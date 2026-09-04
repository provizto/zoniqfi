const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { Metaplex, keypairIdentity } = require("@metaplex-foundation/js");
const fs = require("fs");

async function main() {
  console.log("Menghubungkan ke Solana Devnet...");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("./devnet-key.json", "utf-8")));
  const payer = Keypair.fromSecretKey(secretKey);

  const metaplex = Metaplex.make(connection).use(keypairIdentity(payer));
  const mintAddress = new PublicKey("6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz");

  console.log("Mengambil data metadata yang ada...");
  const sft = await metaplex.nfts().findByMint({ mintAddress });

  console.log("Memperbarui Metadata ke https://zoniqfi.com/metadata.json ...");
  const { response } = await metaplex.nfts().update({
    nftOrSft: sft,
    name: "ZoniqFi",
    symbol: "ZQI",
    uri: "https://zoniqfi.com/metadata.json",
  });

  console.log("✅ Metadata Token  Berhasil Diperbarui!");
  console.log("Signature:", response.signature);
}

main().catch(console.error);
