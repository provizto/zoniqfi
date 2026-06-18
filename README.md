# ⚡ ZoniqFi Hub — Premium Solana White-Label dApp Infrastructure

ZoniqFi Hub adalah infrastruktur DeFi *turnkey ready-to-deploy* premium yang dirancang khusus untuk jaringan Solana. Dikembangkan menggunakan React, Vite, dan terintegrasi penuh dengan **Jupiter Price API v2** serta **Jito MEV-Protection Engine**, repositori ini menyediakan modul utilitas instan bagi proyek koin atau token komunitas guna meningkatkan retensi holder, mempercepat volume transaksi, dan membangun ekosistem riil dalam 24 jam.

---

## 🚀 Fitur Utama & Arsitektur Modular (Devnet Verified)

Aplikasi ini menggunakan sistem **Kecerdasan Deteksi Paket** otomatis berbasis parameter URL (`?pkg=...`). Anda dapat menjual produk ini secara terpisah atau beralih ke paket komersial penuh (*Ultimate Suite*) hanya melalui konfigurasi *environment variables*.

### 1. AMM DEX Swap (Anti-MEV Secure)
* **Live Price Feeds:** Sinkronisasi harga pasar riil secara otomatis setiap 30 detik memanfaatkan agregator likuiditas nomor satu di Solana (Jupiter API v2).
* **Jito MEV Shield:** Melindungi transaksi pengguna dari taktik pembajakan bot (*sandwich attacks*) menggunakan simulasi bundel transaksi privat Jito.
* **Anti-Wash Trading:** Algoritma internal untuk memantau siklus transaksi harian guna menjaga keaslian pergerakan grafik pasar.

### 2. Yield Optimizer Vaults
* **Auto-Compounding Logic:** Protokol pengelolaan aset otomatis yang menawarkan simulasi keuntungan harian optimal (hingga 0.11% per hari / 49.1% APY).
* **Interactive Forecast Calculator:** Panel kalkulator proyeksi pendapatan tersemat (Harian, Bulanan, Tahunan) untuk memikat interaksi psikologis pengguna dalam menyimpan aset.

### 3. ZQI Lock & Yield Hub
* **Cryptographic Staking Epoch:** Mekanisme penguncian token utilitas kustom **$ZQI** dalam Horizon Waktu 7-Hari yang aman secara on-chain.
* **Real Yield Distribution:** Hadiah staking didistribusikan menggunakan mata uang stabil (USDC), memitigasi tekanan jual pada token utama proyek.
* **Emergency Early Unlock System:** Aturan tegas dApp di mana pembukaan kunci prematur dikenakan penalti pemusnahan aset sebesar 10% (*Deflationary Burn Penalty*).

### 4. Tiered On-Chain Affiliate (Referral System)
* **Sybil Attack Prevention:** Pembatasan ketat laju eksekusi tautan (maksimal 1 transaksi per 10 detik) untuk memblokir eksploitasi multi-wallet palsu.
* **Dynamic Tiering Matrix:** Sistem kalkulasi level volume otomatis berdasarkan rujukan pengguna:
    * **Bronze Tier:** Volume $0 - $10,000 ➜ Komisi 10%
    * **Silver Tier:** Volume $10,001 - $100,000 ➜ Komisi 18%
    * **Gold Tier:** Volume > $100,000 ➜ Komisi 25%

---

## 📊 Matriks Integrasi Data Pasar Riil (Jupiter Price API)

Aplikasi ini secara bawaan melacak token utama Solana berikut di latar belakang menggunakan alamat mint resmi mereka:

| Token Asset | Deskripsi | Status Data |
| :--- | :--- | :--- |
| **SOL / WSOL** | Solana Native & Wrapped | Live Market Feed |
| **USDC / USDT** | Fiat Stablecoins | Live Market Feed |
| **ZQI** | ZoniqFi Utility Token ($0.50 Base) | Locked/Statis (Dapat dikustomisasi) |
| **WIF / BONK / POPCAT** | Blue-chip Solana Meme Coins | Live Market Feed |
| **RENDER** | AI DePIN Network Token | Live Market Feed |
| **JitoSOL / JUP / PYTH** | DeFi Infrastructure Assets | Live Market Feed |

---

## 💼 Skema Komersialisasi & Struktur Paket Lisensi

Template dApp ini dikemas untuk mendukung 5 model monetisasi lisensi *software*:

1.  **Entry / Viral Launch ($499):** Swap Modul + Sistem Afiliasi (Optimal untuk koin meme mikro-kapitalisasi).
2.  **Token Velocity ($1,299):** Paket Swap + Yield Optimizer + Afiliasi (Mengurangi tekanan jual pasar).
3.  **Whale Retention Suite ($1,199):** Token Locker Hub + Real Yield USDC Pool + Afiliasi (Mengunci suplai beredar).
4.  **Safe Staking Hub ($1,099):** Yield Optimizer + Token Locker Hub (Murni DeFi manajemen aset).
5.  **Ultimate DeFi Suite ($2,499):** Akses penuh seluruh modul 4-in-1 secara komprehensif.

---

## 🛠️ Panduan Instalasi Lokal (Development)

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) di perangkat Anda sebelum memulai proses instalasi.

1.  **Kloning Repositori:**
    ```bash
    git clone [https://github.com/username/zoniqfi-hub.git](https://github.com/username/zoniqfi-hub.git)
    cd zoniqfi-hub
    ```

2.  **Instalasi Dependensi:**
    ```bash
    npm install
    ```

3.  **Jalankan Server Lokal:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di alamat `http://localhost:5173`.

4.  **Uji Coba Tampilan Paket:**
    Tambahkan query string di ujung URL lokal untuk menguji fungsionalitas visual masing-masing lisensi paket:
    * `http://localhost:5173/?pkg=entry`
    * `http://localhost:5173/?pkg=velocity`
    * `http://localhost:5173/?pkg=whale`
    * `http://localhost:5173/?pkg=staking`

---

## 🌐 Produksi & Deployment (Vercel Ready)

Script dApp ini telah dioptimalisasi secara penuh agar **100% Lolos Uji Build Sukses** di platform Vercel atau Netlify. Seluruh aset gambar broken link telah dibersihkan demi menjaga estetika visual UI/UX minimalis yang modern.

* **Cluster Network Default:** `Solana Devnet` (Menghindari pemborosan gas fee SOL asli selama masa demo penjualan ke klien).
* **Migrasi ke Mainnet:** Cukup ubah parameter variabel string `SOLANA_NETWORK` dari `"devnet"` ke `"mainnet-beta"` saat produk siap diluncurkan secara komersial oleh pembeli lisensi Anda.

---

© 2026 ZoniqFi. All Rights Reserved. Premium Solana Software-as-a-Service (SaaS) Infrastructure.