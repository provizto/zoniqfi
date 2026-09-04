const { Connection, Keypair, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, transfer } = require('@solana/spl-token');
const fs = require('fs');

async function main() {
  const RECIPIENT_WALLET = "9bvD1899yYZCf2MKeuds59EXAGgVBwuFkrCS1Cgo3AhS";
  const MINT_ADDRESS = "6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz";
  const AMOUNT = 1_000_000n * 1_000_000n; // 1.000.000 ZQI (6 desimal)

  console.log('🔄 Menghubungkan ke Solana Devnet...');
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync('devnet-key.json', 'utf-8')));
  const sender = Keypair.fromSecretKey(secretKey);

  console.log(`🔑 Wallet Pengirim : ${sender.publicKey.toBase58()}`);
  console.log(`🎯 Wallet Penerima : ${RECIPIENT_WALLET}`);

  console.log('📦 Menyiapkan akun token pengirim & penerima...');
  const senderATA = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    new PublicKey(MINT_ADDRESS),
    sender.publicKey
  );

  const recipientATA = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    new PublicKey(MINT_ADDRESS),
    new PublicKey(RECIPIENT_WALLET)
  );

  console.log('🚀 Mengirim 1.000.000 $ZQI...');
  const signature = await transfer(
    connection,
    sender,
    senderATA.address,
    recipientATA.address,
    sender,
    AMOUNT
  );

  console.log('\n================ SUKSES TRANSFER ================');
  console.log(`Jumlah  : 1,000,000 $ZQI`);
  console.log(`Penerima: ${RECIPIENT_WALLET}`);
  console.log(`Solscan : https://solscan.io/tx/${signature}?cluster=devnet`);
  console.log('==================================================');
}

main().catch(console.error);