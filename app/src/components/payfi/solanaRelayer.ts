// Solana Relay Hash Generator for Direct QRIS & Gas Tank Architecture
export async function sendRelayTransaction(priceSol: number): Promise<string> {
  // Simulasi latensi jaringan Solana Devnet
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Menghasilkan Mock Solana Transaction Hash 64-karakter yang valid
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let hash = "";
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${hash}5ydevnet`;
}