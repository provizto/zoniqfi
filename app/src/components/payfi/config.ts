// Konfigurasi Netral Gateway ZoniqFi (Solana Cluster)
export const SOLANA_NETWORK = "devnet";
export const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com";

export const APP_METADATA = {
  name: "ZoniqFi PayFi Gateway",
  description: "Hybrid Web3 & Fiat Digital Commerce Ecosystem",
  url: typeof window !== "undefined" ? window.location.origin : "https://www.zoniqfinance.com",
};

export const config = {
  network: SOLANA_NETWORK,
  endpoint: SOLANA_RPC_ENDPOINT,
  metadata: APP_METADATA
};

export default config;