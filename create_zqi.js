const { Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const fs = require('fs');

async function main() {
  console.log('🔄 Menghubungkan ke Solana Devnet...');
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // 1. Simpan & Pakai Kunci Tetap (agar alamat wallet tidak berubah-ubah)
  const KEY_FILE = 'devnet-key.json';
  let payer;
  if (fs.existsSync(KEY_FILE)) {
    const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(KEY_FILE, 'utf-8')));
    payer = Keypair.fromSecretKey(secretKey);
  } else {
    payer = Keypair.generate();
    fs.writeFileSync(KEY_FILE, JSON.stringify(Array.from(payer.secretKey)));
  }

  const walletAddress = payer.publicKey.toBase58();
  console.log(`\n🔑 Alamat Wallet Pembuat Token: ${walletAddress}`);

  // 2. Periksa Saldo SOL
  let balance = await connection.getBalance(payer.publicKey);
  console.log(`💰 Saldo saat ini: ${balance / LAMPORTS_PER_SOL} SOL`);

  if (balance < 0.5 * LAMPORTS_PER_SOL) {
    console.log('⏳ Saldo kurang, mencoba request airdrop otomatis...');
    try {
      const airdropSig = await connection.requestAirdrop(payer.publicKey, 1 * LAMPORTS_PER_SOL);
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSig,
      });
      console.log('✅ Airdrop otomatis berhasil!');
    } catch (e) {
      console.log('\n================ PERHATIAN ================');
      console.log('Airdrop otomatis terkena limit antrean jaringan.');
      console.log('Silakan klaim 1 SOL gratis via browser:');
      console.log('1. Buka: https://faucet.solana.com');
      console.log(`2. Masukkan alamat ini: ${walletAddress}`);
      console.log('3. Setelah sukses di web, jalankan ulang: node create_zqi.js');
      console.log('===========================================\n');
      return;
    }
  }

  // 3. Buat Mint Token $ZQI (6 Desimal)
  console.log('🚀 Mendaftarkan Mint Token $ZQI...');
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    payer.publicKey,
    6
  );

  // 4. Buat Akun Dompet Penampung Koin
  console.log('📦 Menyiapkan akun saldo koin...');
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  // 5. Cetak 100.000.000 Token $ZQI
  const supplyAmount = 100_000_000n * 1_000_000n;
  console.log('💰 Mencetak 100,000,000 $ZQI...');
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,
    supplyAmount
  );

  console.log('\n================ SUKSES TERCETAK ================');
  console.log(`MINT ADDRESS $ZQI : ${mint.toBase58()}`);
  console.log(`LIHAT DI SOLSCAN  : https://solscan.io/token/${mint.toBase58()}?cluster=devnet`);
  console.log('==================================================');
}

main().catch(console.error);