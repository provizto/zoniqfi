import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  sendAndConfirmTransaction, 
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";

const RELAYER_SECRET = Uint8Array.from([
  52,144,151,252,110,176,46,189,171,255,202,155,242,52,78,136,
  3,158,105,113,168,132,83,241,73,10,146,249,100,144,145,200,
  184,190,187,167,175,217,70,210,43,114,149,245,168,66,163,98,
  79,132,96,2,252,172,22,16,116,181,139,5,143,210,222,166
]);

const relayerKeypair = Keypair.fromSecretKey(RELAYER_SECRET);

const VAULT_PUBKEY = new PublicKey("BvmRYWTbkCwNqVUEeD7qgVqzM9rXh9egrDiWDBcsofny");
const LOCKER_PUBKEY = new PublicKey("H8XSVM7UDZbk5eFhzWMLU5WPKZwNLBo85wGbrfPDX6Gw");
const AFFILIATE_PUBKEY = new PublicKey("FU6cLtPS4eUBy92xa96Fb7pdaFv8A93LdEpT7MyHi7uh");
const OPS_PUBKEY = new PublicKey("6PYRmzMiJvEjFS1qKHB5YwfkKyZv7e5CAbTnxtbPDLc4");

export async function sendRelayTransaction(priceSol: number): Promise<string> {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const totalFeeLamports = Math.floor((priceSol * 0.05) * LAMPORTS_PER_SOL);
  const vaultLamports = Math.floor(totalFeeLamports * 0.40);
  const lockerLamports = Math.floor(totalFeeLamports * 0.30);
  const affiliateLamports = Math.floor(totalFeeLamports * 0.15);
  const opsLamports = Math.floor(totalFeeLamports * 0.15);

  const transaction = new Transaction().add(
    SystemProgram.transfer({ fromPubkey: relayerKeypair.publicKey, toPubkey: VAULT_PUBKEY, lamports: vaultLamports }),
    SystemProgram.transfer({ fromPubkey: relayerKeypair.publicKey, toPubkey: LOCKER_PUBKEY, lamports: lockerLamports }),
    SystemProgram.transfer({ fromPubkey: relayerKeypair.publicKey, toPubkey: AFFILIATE_PUBKEY, lamports: affiliateLamports }),
    SystemProgram.transfer({ fromPubkey: relayerKeypair.publicKey, toPubkey: OPS_PUBKEY, lamports: opsLamports })
  );

  return await sendAndConfirmTransaction(connection, transaction, [relayerKeypair]);
}