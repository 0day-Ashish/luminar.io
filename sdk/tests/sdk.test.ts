/// <reference types="jest" />
import { requestAttestations } from "../src/oracle";
import { LuminarClient } from "../src/contracts";
import { SDKConfig } from "../src/types";

// Mock the entire Stellar SDK to isolate tests and avoid ESM node_modules import issues in Jest
jest.mock("@stellar/stellar-sdk", () => {
  return {
    Contract: jest.fn().mockImplementation(() => ({
      call: jest.fn()
    })),
    Account: jest.fn().mockImplementation(() => ({})),
    Networks: { PUBLIC: "PUBLIC", TESTNET: "TESTNET" },
    rpc: {
      Server: jest.fn().mockImplementation(() => ({
        simulateTransaction: jest.fn(),
        getAccount: jest.fn(),
        getTransaction: jest.fn(),
        sendTransaction: jest.fn()
      })),
      Api: {
        isSimulationSuccess: jest.fn()
      }
    },
    nativeToScVal: jest.fn(),
    scValToNative: jest.fn(),
    xdr: {
      ScVal: {
        scvBytes: jest.fn()
      }
    },
    TransactionBuilder: jest.fn().mockImplementation(() => ({
      addOperation: jest.fn().mockReturnThis(),
      setTimeout: jest.fn().mockReturnThis(),
      build: jest.fn()
    })),
    TimeoutInfinite: 0,
    Transaction: jest.fn()
  };
});

// Mock Freighter API
jest.mock("@stellar/freighter-api", () => {
  return {
    isConnected: jest.fn(),
    getAddress: jest.fn(),
    signTransaction: jest.fn()
  };
});

// Mock global fetch for oracle attestation tests
const mockGlobalFetch = jest.fn();
global.fetch = mockGlobalFetch as any;

describe("Luminar SDK Attestation Client", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should request attestations successfully from oracle service", async () => {
    const mockOracleResponse = {
      name_hash: "0xnamehash",
      id_hash: "0xidhash",
      secret: "0xsecret",
      dob_timestamp: 800000000,
      doc_type: "PAN",
      oracle1_sig: "0x123",
      oracle2_sig: "0x456",
      oracle3_sig: "0x789"
    };

    mockGlobalFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockOracleResponse
    });

    const result = await requestAttestations("https://mock-oracle.luminar.io", {
      name: "Alice Doe",
      dob: "1995-05-15",
      docNumber: "ABCDE1234F",
      documentType: "PAN"
    });

    expect(mockGlobalFetch).toHaveBeenCalledWith(
      "https://mock-oracle.luminar.io/verify",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
    );

    expect(result.nameHash).toBe("0xnamehash");
    expect(result.idHash).toBe("0xidhash");
    expect(result.dobTimestamp).toBe(800000000);
    expect(result.oracle1Sig).toBe("0x123");
  });

  it("should throw error if oracle request fails", async () => {
    mockGlobalFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Invalid PAN format" })
    });

    await expect(
      requestAttestations("https://mock-oracle.luminar.io", {
        name: "Alice Doe",
        dob: "1995-05-15",
        docNumber: "invalid",
        documentType: "PAN"
      })
    ).rejects.toThrow("Invalid PAN format");
  });
});

describe("LuminarClient Contract Interactor", () => {
  const config: SDKConfig = {
    oracleUrl: "https://mock-oracle.luminar.io",
    registryContractId: "CCGSPB7P2PTI7SPUN2EGWPPCGL5SGNIZ7AAVFKBTFBSIY7XCMSOKHZ4B",
    verifierContractId: "CCSIAHS2UOARAAEZW5CNV2RNJNOPOPSXM7J3FT764K6E4YZZFTCE76N6",
    sbtContractId: "CB2Y2S7N6ERY6YAC6M2KCDPVF4CSEDVEHN5OIFIUQWA37BATYJBFZVBP",
    network: "testnet",
    rpcUrl: "https://soroban-testnet.stellar.org"
  };

  it("should initialize client correctly", () => {
    const client = new LuminarClient(config);
    expect(client).toBeDefined();
  });
});
