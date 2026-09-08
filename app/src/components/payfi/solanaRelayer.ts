// Solana Relay Hash Generator for Direct QRIS & Gas Tank Architecture
export async function sendRelayTransaction(priceSol: number): Promise<string> {
  // Simulasi latensi jaringan Solana Devnet
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Signature Solana (Ed25519) adalah 64 bytes = 88 karakter Base58
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let signature = "";
  for (let i = 0; i < 88; i++) {
    signature += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return signature;
}