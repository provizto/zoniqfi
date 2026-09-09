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

const RELAYER_PRIVATE_KEY_BASE58 = 
  import.meta.env.VITE_RELAYER_PRIVATE_KEY_BASE58 || 
  "3M1GZiPvdarv48Qk5cRMowe49eytyobhGumjogeAMxKmwcAqnXbRgcswF8PoBasvaif7Vt4P97ogsME2FZtBghWY"; 

// Alamat 4 Pool Resmi ZoniqFi sesuai UI
const PROTOCOL_POOLS = {
  VAULT: "BvmRYWTbkCwNqVUEeD7qgVqzM9rXh9egrDiWDBcsofny",       // 1. Yield Optimizer Vault (40%)
  LOCK: "H8XSVM7UDZbk5eFhzWMLU5WPKZwNLBo85wGbrfPDX6Gw",        // 2. ZQI Real Yield Pool / Lock (30%)
  AFFILIATE: "FU6cLtPS4eUBy92xa96Fb7pdaFv8A93LdEpT7MyHi7uh",   // 3. Affiliate Treasury (15%)
  OPS: "6PYRmzMiJvEjFS1qKHB5YwfkKyZv7e5CAbTnxtbPDLc4"          // 4. Project Treasury Operations (15%)
};

export async function sendRelayTransaction(totalFeeSol: number): Promise<string> {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  let relayerKeypair: Keypair;
  try {
    relayerKeypair = Keypair.fromSecretKey(bs58.decode(RELAYER_PRIVATE_KEY_BASE58));
  } catch {
    relayerKeypair = Keypair.generate();
  }

  // 1. Hitung 5% protokol fee dari total harga produk
  const actualProductPrice = totalFeeSol > 0 ? totalFeeSol : 0.015;
  const protocolFeeSol = actualProductPrice * 0.05; // 5% dari harga produk (0.00075 SOL)

  const totalLamports = Math.round(protocolFeeSol * LAMPORTS_PER_SOL);
  const safeTotal = totalLamports > 0 ? totalLamports : 750000; // fallback 0.00075 SOL

  // 2. Proporsi fee presisi (40%, 30%, 15%, 15%)
  const lamportsVault = Math.round(safeTotal * 0.40);      // -> 0.00030 SOL
  const lamportsLock = Math.round(safeTotal * 0.30);       // -> 0.000225 SOL
  const lamportsAffiliate = Math.round(safeTotal * 0.15);  // -> 0.0001125 SOL
  const lamportsOps = safeTotal - (lamportsVault + lamportsLock + lamportsAffiliate); // -> 0.0001125 SOL

  // 3. Susun transaksi multi-pool + Priority Fee anti-lag
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
    console.warn("Multi-pool relay broadcast error:", err);
    throw err;
  }
}