const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { initializeApp, cert } = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

let db = null;
let useLocalDb = false;
const LOCAL_DB_PATH = path.join(__dirname, "local_secrets_db.json");

// Helper to get/set local JSON DB
function readLocalDb() {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({}), "utf8");
    }
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf8"));
  } catch (err) {
    console.error("Error reading local JSON DB:", err);
    return {};
  }
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing local JSON DB:", err);
  }
}

// Initialize Firebase Admin
try {
  let serviceAccount = null;
  const localFirebaseJson = path.join(process.cwd(), "firebase.json");
  const parentFirebaseJson = path.join(process.cwd(), "..", "frontend", "firebase.json");

  if (fs.existsSync(localFirebaseJson)) {
    serviceAccount = JSON.parse(fs.readFileSync(localFirebaseJson, "utf8"));
    console.log("Oracle: Found firebase.json in current directory.");
  } else if (fs.existsSync(parentFirebaseJson)) {
    serviceAccount = JSON.parse(fs.readFileSync(parentFirebaseJson, "utf8"));
    console.log("Oracle: Found firebase.json in frontend directory.");
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const val = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
    if (val.startsWith("{")) {
      serviceAccount = JSON.parse(val);
    } else {
      serviceAccount = JSON.parse(Buffer.from(val, "base64").toString("utf8"));
    }
    console.log("Oracle: Found FIREBASE_SERVICE_ACCOUNT environment variable.");
  }

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
    });
    // Use the custom database ID "support" just like frontend
    try {
      db = getFirestore("support");
      console.log("Oracle: Firebase Admin successfully initialized using 'support' database.");
    } catch (e) {
      db = getFirestore();
      console.log("Oracle: Firebase Admin successfully initialized using default database.");
    }
  } else {
    console.warn("WARNING: Firebase service account details not found. Running in Local JSON fallback mode.");
    useLocalDb = true;
  }
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  console.warn("Falling back to Local JSON database.");
  useLocalDb = true;
}

// Database helper operations
async function getStoredSecret(idHashHex) {
  if (useLocalDb || !db) {
    const localDb = readLocalDb();
    return localDb[idHashHex] || null;
  }

  try {
    const docRef = db.collection("oracle_secrets").doc(idHashHex);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data().secret;
    }
    return null;
  } catch (err) {
    console.error("Error fetching secret from Firestore:", err);
    // Fall back to local DB if firestore query fails (robustness)
    const localDb = readLocalDb();
    return localDb[idHashHex] || null;
  }
}

async function saveStoredSecret(idHashHex, secretHex) {
  if (useLocalDb || !db) {
    const localDb = readLocalDb();
    localDb[idHashHex] = secretHex;
    writeLocalDb(localDb);
    return;
  }

  try {
    const docRef = db.collection("oracle_secrets").doc(idHashHex);
    await docRef.set({
      secret: secretHex,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error saving secret to Firestore:", err);
    // Fallback to local DB
    const localDb = readLocalDb();
    localDb[idHashHex] = secretHex;
    writeLocalDb(localDb);
  }
}

// BN254 (alt_bn128) scalar field prime — all field elements are reduced mod this
const BN254_PRIME = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
const ORACLE_SECRET_KEY = process.env.ORACLE_SECRET_KEY;
const SUREPASS_TOKEN = process.env.SUREPASS_TOKEN;

if (!ORACLE_SECRET_KEY) {
  console.error(
    "FATAL: ORACLE_SECRET_KEY environment variable is not set.\n" +
      "       Export it before starting the server:\n" +
      '       export ORACLE_SECRET_KEY="your-secret-key-here"'
  );
  process.exit(1);
}

if (!SUREPASS_TOKEN) {
  console.warn(
    "WARNING: SUREPASS_TOKEN is not set. PAN verification via Surepass will fail.\n" +
      '         export SUREPASS_TOKEN="your-surepass-token-here"'
  );
}



// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a Buffer / Uint8Array to a BigInt reduced mod BN254 prime. */
function bufferToBigInt(buf) {
  return BigInt("0x" + Buffer.from(buf).toString("hex")) % BN254_PRIME;
}

/**
 * Validate a document number based on its type.
 *  - pan:      5 uppercase letters + 4 digits + 1 uppercase letter  (ABCDE1234F)
 *  - aadhaar:  exactly 12 digits
 *  - passport: 1 uppercase letter + 7 digits  (Indian passport, e.g. A1234567)
 *
 * Returns an object: { valid: boolean, error?: string }
 */
function isValidDocument(idNumber, docType) {
  const FORMATS = {
    pan:      { regex: /^[A-Z]{5}[0-9]{4}[A-Z]$/,  example: "ABCDE1234F" },
    aadhaar:  { regex: /^\d{12}$/,                   example: "123456789012" },
    passport: { regex: /^[A-Z]{1}[0-9]{7}$/,         example: "A1234567" },
  };

  const fmt = FORMATS[docType];
  if (!fmt) {
    return {
      valid: false,
      error: `Unsupported document type: "${docType}". Accepted: ${Object.keys(FORMATS).join(", ")}.`,
    };
  }

  if (!fmt.regex.test(idNumber)) {
    return {
      valid: false,
      error: `Invalid ${docType.toUpperCase()} format. Expected pattern like ${fmt.example}.`,
    };
  }

  return { valid: true };
}

/**
 * Parse a date string (YYYY-MM-DD or any Date-parseable format) into a Unix
 * timestamp in seconds.  Returns `null` on invalid input.
 */
function parseDobTimestamp(dob) {
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  return Math.floor(d.getTime() / 1000);
}

/**
 * Verify a PAN number against the Surepass sandbox API.
 * Makes a POST request to the PAN comprehensive endpoint.
 * Returns `true` if the document is valid, `false` otherwise.
 */
async function verifyWithSurepass(idNumber) {
  try {
    const response = await fetch(
      "https://sandbox.surepass.io/api/v1/pan/pan-comprehensive",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUREPASS_TOKEN}`,
        },
        body: JSON.stringify({ id_number: idNumber }),
      }
    );

    const data = await response.json();
    return data.data?.valid === true;
  } catch (err) {
    console.error("Surepass PAN verification error:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// ---- GET /health ----------------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "luminar-oracle",
    timestamp: new Date().toISOString(),
  });
});

// ---- POST /verify ---------------------------------------------------------
app.post("/verify", async (req, res) => {
  try {
    const { name, dob, id_number, country, doc_type } = req.body;

    // ------------------------------------------------------------------
    // 1. Validate required fields
    // ------------------------------------------------------------------
    const missing = [];
    if (!name) missing.push("name");
    if (!dob) missing.push("dob");
    if (!id_number) missing.push("id_number");
    if (!country) missing.push("country");
    if (!doc_type) missing.push("doc_type");

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    // ------------------------------------------------------------------
    // 2. Document format validation (type-aware)
    // ------------------------------------------------------------------
    const docTypeLower = doc_type.toLowerCase();
    const formatCheck = isValidDocument(id_number, docTypeLower);
    if (!formatCheck.valid) {
      return res.status(400).json({ error: formatCheck.error });
    }

    // ------------------------------------------------------------------
    // 3. Live document verification (where available)
    // ------------------------------------------------------------------
    if (docTypeLower === "pan") {
      // PAN cards are verified against the Surepass sandbox API to
      // confirm the document actually exists in government records.
      // If SUREPASS_TOKEN is not configured, fall back to format-only validation.
      if (SUREPASS_TOKEN) {
        const panValid = await verifyWithSurepass(id_number);
        if (!panValid) {
          return res.status(422).json({
            error: "PAN verification failed. Document not found or invalid.",
          });
        }
      } else {
        console.warn("SUREPASS_TOKEN not set — PAN accepted via format validation only.");
      }
    }
    // Aadhaar: Format validation only.
    // Live Aadhaar OTP-based verification requires a licensed AUA
    // (Authentication User Agency) registered with UIDAI. This is
    // not available in a sandbox environment and needs a production
    // licence to integrate.
    //
    // Passport: Format validation only.
    // Live passport verification requires integration with an
    // international identity verification API (e.g. Surepass Passport
    // OCR, or government MRP/ICAO lookups) which is not yet
    // configured for this environment.

    // ------------------------------------------------------------------
    // 3. Parse date of birth
    // ------------------------------------------------------------------
    const dobTimestamp = parseDobTimestamp(dob);
    if (dobTimestamp === null) {
      return res.status(400).json({
        error: "Invalid date of birth. Use ISO 8601 format (YYYY-MM-DD).",
      });
    }

    // ------------------------------------------------------------------
    // 4. Hash private inputs with SHA-256 and reduce to BN254 field elements
    // ------------------------------------------------------------------
    const nameHash = crypto.createHash("sha256").update(name).digest();
    const idHash = crypto.createHash("sha256").update(id_number).digest();

    const nameHashField = bufferToBigInt(nameHash);
    const idHashField = bufferToBigInt(idHash);

    const nameHashHex = "0x" + nameHashField.toString(16).padStart(64, "0");
    const idHashHex = "0x" + idHashField.toString(16).padStart(64, "0");

    // ------------------------------------------------------------------
    // 5. Get or generate the cryptographically secure secret (32 bytes)
    //    We key the secret on the unique document id_hash for sybil protection.
    // ------------------------------------------------------------------
    let secretHex = await getStoredSecret(idHashHex);
    if (!secretHex) {
      const secretBytes = crypto.randomBytes(32);
      const secretField = bufferToBigInt(secretBytes);
      secretHex = "0x" + secretField.toString(16).padStart(64, "0");
      await saveStoredSecret(idHashHex, secretHex);
    }

    // ------------------------------------------------------------------
    // 7. Sign the payload with HMAC-SHA256
    //    doc_type is included so the credential is bound to the
    //    specific document kind that was verified.
    // ------------------------------------------------------------------
    const signaturePayload = `${nameHashHex}:${idHashHex}:${secretHex}:${dobTimestamp}:${docTypeLower}`;
    const oracleSignature = crypto
      .createHmac("sha256", ORACLE_SECRET_KEY)
      .update(signaturePayload)
      .digest("hex");

    // ------------------------------------------------------------------
    // 8. Return the credential payload
    // ------------------------------------------------------------------
    return res.json({
      name_hash: nameHashHex,
      id_hash: idHashHex,
      secret: secretHex,
      dob_timestamp: dobTimestamp,
      doc_type: docTypeLower,
      oracle_signature: oracleSignature,
    });
  } catch (err) {
    console.error("Error in POST /verify:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Luminar Oracle running → http://localhost:${PORT}`);
  console.log(`  POST /verify   — issue KYC hashes + secret`);
  console.log(`  GET  /health   — liveness check`);
});
