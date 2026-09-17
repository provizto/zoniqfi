/// <reference types="vite/client" />

import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";
import bs58 from "bs58";

// Peringatan: Gunakan hanya untuk Devnet sandbox hackathon demo
const RELAYER_PRIVATE_KEY_BASE58 = 
  import.meta.env.VITE_RELAYER_PRIVATE_KEY_BASE58 || 
  "3M1GZiPvdarv48Qk5cRMowe49eytyobhGumjogeAMxKmwcAqnXbRgcswF8PoBasvaif7Vt4P97ogsME2FZtBghWY"; 

const PROTOCOL_POOLS = {
  VAULT: "BvmRYWTbkCwNqVUEeD7qgVqzM9rXh9egrDiWDBcsofny",      // 1. Yield Optimizer Vault (40%)
  LOCK: "H8XSVM7UDZbk5eFhzWMLU5WPKZwNLBo85wGbrfPDX6Gw",       // 2. ZQI Real Yield Pool / Lock (30%)
  AFFILIATE: "FU6cLtPS4eUBy92xa96Fb7pdaFv8A93LdEpT7MyHi7uh",  // 3. Affiliate Treasury (15%)
  OPS: "6PYRmzMiJvEjFS1qKHB5YwfkKyZv7e5CAbTnxtbPDLc4"         // 4. Project Treasury Operations (15%)
};

/**
 * Mengirim transaksi relayer PayFi untuk memotong fee protokol 5% 
 * dan membaginya ke 4 pool protokol secara atomik di Devnet.
 * 
 * @param productPriceSol Harga dasar produk/lisensi dalam satuan SOL
 */
export async function sendRelayTransaction(productPriceSol: number): Promise<string> {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  let relayerKeypair: Keypair;
  try {
    relayerKeypair = Keypair.fromSecretKey(bs58.decode(RELAYER_PRIVATE_KEY_BASE58));
  } catch (decodeErr) {
    throw new Error("Relayer configuration failure: Invalid base58 secret key.");
  }

  // 1. Hitung 5% protokol fee dari total harga produk
  const actualProductPrice = productPriceSol > 0 ? productPriceSol : 0.015;
  const protocolFeeSol = actualProductPrice * 0.05; // Misal 0.015 SOL -> 0.00075 SOL

  const totalLamports = Math.round(protocolFeeSol * LAMPORTS_PER_SOL);
  const safeTotal = totalLamports > 0 ? totalLamports : 750_000;

  // 2. Proporsi fee presisi (40%, 30%, 15%, 15%)
  const lamportsVault = Math.round(safeTotal * 0.40);
  const lamportsLock = Math.round(safeTotal * 0.30);
  const lamportsAffiliate = Math.round(safeTotal * 0.15);
  // Sisa selisih pembulatan dialokasikan ke Ops agar total tepat sama dengan safeTotal
  const lamportsOps = safeTotal - (lamportsVault + lamportsLock + lamportsAffiliate);

  // 3. Verifikasi saldo gas tank relayer sebelum kirim
  const relayerBalance = await connection.getBalance(relayerKeypair.publicKey);
  const requiredBalance = safeTotal + 100_000; // Total split + estimasi tx fee

  if (relayerBalance < requiredBalance) {
    throw new Error(
      `Relayer Gas Tank Insufficient: Membutuhkan ${(requiredBalance / LAMPORTS_PER_SOL).toFixed(5)} SOL, ` +
      `tersedia ${(relayerBalance / LAMPORTS_PER_SOL).toFixed(5)} SOL.`
    );
  }

  // 4. Susun instruksi atomik 4-way fee transfer
  const transaction = new Transaction().add(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 300_000 }),
    SystemProgram.transfer({
      fromPubkey: relayerKeypair.publicKey,
      toPubkey: new PublicKey(PROTOCOL_POOLS.VAULT),
      lamports: lamportsVault,
    }),
    SystemProgram.transfer({
      fromPubkey: relayerKeypair.publicKey,
      toPubkey: new PublicKey(PROTOCOL_POOLS.LOCK),
      lamports: lamportsLock,
    }),
    SystemProgram.transfer({
      fromPubkey: relayerKeypair.publicKey,
      toPubkey: new PublicKey(PROTOCOL_POOLS.AFFILIATE),
      lamports: lamportsAffiliate,
    }),
    SystemProgram.transfer({
      fromPubkey: relayerKeypair.publicKey,
      toPubkey: new PublicKey(PROTOCOL_POOLS.OPS),
      lamports: lamportsOps,
    })
  );

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = relayerKeypair.publicKey;

  try {
    const signature = await connection.sendTransaction(transaction, [relayerKeypair]);
    
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    }, "confirmed");

    return signature;
  } catch (err) {
    console.error("Multi-pool relay broadcast error:", err);
    throw err;
  }
}