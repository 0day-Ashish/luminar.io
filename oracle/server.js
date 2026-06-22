const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

// BN254 (alt_bn128) scalar field prime — all field elements are reduced mod this
const BN254_PRIME = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
const ORACLE_SECRET_KEY = process.env.ORACLE_SECRET_KEY;

if (!ORACLE_SECRET_KEY) {
  console.error(
    "FATAL: ORACLE_SECRET_KEY environment variable is not set.\n" +
      "       Export it before starting the server:\n" +
      '       export ORACLE_SECRET_KEY="your-secret-key-here"'
  );
  process.exit(1);
}



// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a Buffer / Uint8Array to a BigInt reduced mod BN254 prime. */
function bufferToBigInt(buf) {
  return BigInt("0x" + Buffer.from(buf).toString("hex")) % BN254_PRIME;
}

/**
 * Validate an Indian identity document number.
 *  - PAN:    5 uppercase letters + 4 digits + 1 uppercase letter  (ABCDE1234F)
 *  - Aadhaar: exactly 12 digits
 */
function isValidIndianId(idNumber) {
  const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const AADHAAR_RE = /^\d{12}$/;
  return PAN_RE.test(idNumber) || AADHAAR_RE.test(idNumber);
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
app.post("/verify", (req, res) => {
  try {
    const { name, dob, id_number, country } = req.body;

    // ------------------------------------------------------------------
    // 1. Validate required fields
    // ------------------------------------------------------------------
    const missing = [];
    if (!name) missing.push("name");
    if (!dob) missing.push("dob");
    if (!id_number) missing.push("id_number");
    if (!country) missing.push("country");

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    // ------------------------------------------------------------------
    // 2. Country-specific ID validation
    // ------------------------------------------------------------------
    const countryLower = country.toLowerCase();
    if (countryLower === "india" || countryLower === "in") {
      if (!isValidIndianId(id_number)) {
        return res.status(400).json({
          error:
            "Invalid Indian ID format. " +
            "Expected PAN (ABCDE1234F) or Aadhaar (12 digits).",
        });
      }
    }

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
    // 4. Hash private inputs with SHA-256
    // ------------------------------------------------------------------
    const nameHash = crypto.createHash("sha256").update(name).digest();
    const idHash = crypto.createHash("sha256").update(id_number).digest();

    // ------------------------------------------------------------------
    // 5. Generate a cryptographically random secret (32 bytes)
    // ------------------------------------------------------------------
    const secretBytes = crypto.randomBytes(32);

    // ------------------------------------------------------------------
    // 6. Reduce to BN254 field elements
    //    The frontend will compute the Poseidon commitment from these.
    // ------------------------------------------------------------------
    const nameHashField = bufferToBigInt(nameHash);
    const idHashField = bufferToBigInt(idHash);
    const secretField = bufferToBigInt(secretBytes);

    const nameHashHex = "0x" + nameHashField.toString(16).padStart(64, "0");
    const idHashHex = "0x" + idHashField.toString(16).padStart(64, "0");
    const secretHex = "0x" + secretField.toString(16).padStart(64, "0");

    // ------------------------------------------------------------------
    // 7. Sign the payload with HMAC-SHA256
    // ------------------------------------------------------------------
    const signaturePayload = `${nameHashHex}:${idHashHex}:${secretHex}:${dobTimestamp}`;
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
