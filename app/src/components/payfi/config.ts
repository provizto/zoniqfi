// Konfigurasi Netral Gateway ZoniqFi (Solana Cluster)
export const SOLANA_NETWORK = "devnet";
export const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com";

export const APP_METADATA = {
  name: "ZoniqFi PayFi Gateway",
  description: "Hybrid Web3 & Fiat Digital Commerce Ecosystem",
  url: typeof window !== "undefined" ? window.location.origin : "https://www.zoniqfinance.com",
};

// ALAMAT WALLET FEE DISTRIBUTION (Sesuaikan dengan public key pool dApp Anda)
export const PROTOCOL_POOLS = {
  VAULT: "9bvD1899yYZCf2MKeuds59EXAGgVBwuFkrCS1Cgo3AhS",            // Yield Optimizer Vault (40%)
  LOCKER: "9bvD1899yYZCf2MKeuds59EXAGgVBwuFkrCS1Cgo3AhS",          // ZQI Real Yield Pool (30%)
  AFFILIATE: "9bvD1899yYZCf2MKeuds59EXAGgVBwuFkrCS1Cgo3AhS",    // Affiliate Treasury (15%)
  OPERATIONS: "9bvD1899yYZCf2MKeuds59EXAGgVBwuFkrCS1Cgo3AhS", // Project Treasury Operations (15%)
};

// PARAMETER FEE GATEWAY (Identik dengan dApp Swap)
export const PAYFI_FEE_CONFIG = {
  TOTAL_FEE_BPS: 500, // 5% total protocol fee
  SPLIT_RATIOS: {
    VAULT: 0.40,      // 40%
    LOCKER: 0.30,     // 30%
    AFFILIATE: 0.15,  // 15%
    OPERATIONS: 0.15, // 15%
  }
};

export const config = {
  network: SOLANA_NETWORK,
  endpoint: SOLANA_RPC_ENDPOINT,
  metadata: APP_METADATA,
  pools: PROTOCOL_POOLS,
  fees: PAYFI_FEE_CONFIG
};

export default config;