const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { Metaplex, keypairIdentity } = require("@metaplex-foundation/js");
const fs = require("fs");

async function main() {
  console.log("Menghubungkan ke Solana Devnet...");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  // Baca private key devnet Anda
  const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("./devnet-key.json", "utf-8")));
  const payer = Keypair.fromSecretKey(secretKey);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(payer));
  const mintAddress = new PublicKey("6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz");

  console.log("Mendaftarkan Metadata untuk Mint:", mintAddress.toBase58());

  const { response } = await metaplex.nfts().createSft({
    useExistingMint: mintAddress,
    name: "ZoniqFi",
    symbol: "ZQI",
    uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-syntax/tokens/tokens/.assets/spl-token.json",
    sellerFeeBasisPoints: 0,
    isMutable: true,
  });

  console.log("✅ Metadata Berhasil Didaftarkan!");
  console.log("Signature Transaksi:", response.signature);
}

main().catch(console.error);
