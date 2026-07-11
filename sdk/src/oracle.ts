import { AttestationRequest } from "./types.js";

export interface AttestationResponse {
  nameHash: string;
  idHash: string;
  secret: string;
  dobTimestamp: number;
  docType: string;
  oracle1Sig: string; // 64-byte hex signature
  oracle2Sig: string; // 64-byte hex signature
  oracle3Sig: string; // 64-byte hex signature
}

/**
 * Sends a verification request to the multi-oracle network and retrieves
 * consensus attestations.
 */
export async function requestAttestations(
  oracleUrl: string,
  payload: AttestationRequest
): Promise<AttestationResponse> {
  const url = oracleUrl.endsWith("/") ? `${oracleUrl}verify` : `${oracleUrl}/verify`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      dob: payload.dob,
      id_number: payload.docNumber,
      doc_type: payload.documentType,
      country: "IN", // default country
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `Oracle attestation request failed with status ${response.status}`);
  }

  return {
    nameHash: result.name_hash,
    idHash: result.id_hash,
    secret: result.secret,
    dobTimestamp: result.dob_timestamp,
    docType: result.doc_type,
    oracle1Sig: result.oracle1_sig,
    oracle2Sig: result.oracle2_sig,
    oracle3Sig: result.oracle3_sig,
  };
}
