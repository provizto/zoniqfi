# ⚡ ZoniqFi Hub — Premium Solana White-Label dApp Infrastructure

ZoniqFi Hub is a premium, turnkey, ready-to-deploy DeFi dApp infrastructure engineered specifically for the Solana blockchain. Built using React, Vite, and fully integrated with the **Jupiter Price API v2** and **Jito MEV-Protection Engine**, this repository delivers instant utility modules for project owners and community tokens to skyrocket holder retention, accelerate trading volume, and establish a real ecosystem within 24 hours.

---

## 🚀 Key Features & Modular Architecture (Devnet Verified)

The application utilizes an intelligent, built-in **Package Detection Engine** driven by URL parameters (`?pkg=...`). This allows you to sell features individually or offer the comprehensive full suite (*Ultimate DeFi Suite*) seamlessly via environment variables.

### 1. AMM DEX Swap (Anti-MEV Secure)
* **Live Price Feeds:** Automatically syncs real-time market rates every 30 seconds by leveraging Solana's premier liquidity aggregator (Jupiter API v2).
* **Jito MEV Shield:** Shields retail traders from malicious front-running and sandwich bots using simulated Jito private transaction bundles.
* **Anti-Wash Trading:** Embedded internal algorithms to track daily transaction cycles, protecting your charts from artificial volume manipulation.

### 2. Yield Optimizer Vaults
* **Auto-Compounding Logic:** Automated asset management protocol offering optimized daily yield simulations (up to 0.11% daily / 49.1% APY).
* **Interactive Forecast Calculator:** An embedded projection panel (Daily, Monthly, Annual metrics) designed to gamify user interaction and incentivize long-term asset locking.

### 3. ZQI Lock & Yield Hub
* **Cryptographic Staking Epoch:** A secure on-chain locking mechanism for the custom native utility token **$ZQI** bound to a 7-day epoch horizon.
* **Real Yield Distribution:** Staking rewards are accrued and paid out in stablecoins (USDC), mitigating selling pressure on the project's primary token.
* **Deflationary Burn Penalty:** Strict protocol enforcement where premature vault unlocks incur a mandatory 10% deflationary supply burn penalty.

### 4. Tiered On-Chain Affiliate (Referral System)
* **Sybil Attack Prevention:** Imposes a strict cooldown rate-limit (maximum 1 transaction per 10 seconds) to completely block multi-wallet bot manipulation.
* **Dynamic Tiering Matrix:** Automated commission tier calculation based on user referral trading volume:
    * **Bronze Tier:** Volume $0 - $10,000 ➜ 10% Commission
    * **Silver Tier:** Volume $10,001 - $100,000 ➜ 18% Commission
    * **Gold Tier:** Volume > $100,000 ➜ 25% Commission

---

## 📊 Live Market Data Integration Matrix (Jupiter Price API)

The dApp actively tracks top-tier Solana ecosystem assets in the background using their official on-chain mint addresses:

| Token Asset | Description | Feed Status |
| :--- | :--- | :--- |
| **SOL / WSOL** | Native Solana & Wrapped SOL | Live Market Feed |
| **USDC / USDT** | Major US Dollar Stablecoins | Live Market Feed |
| **ZQI** | ZoniqFi Utility Token ($0.50 Base) | Locked/Static (Fully Customizable) |
| **WIF / BONK / POPCAT** | Solana Blue-chip Meme Assets | Live Market Feed |
| **RENDER** | AI DePIN Network Token | Live Market Feed |
| **JitoSOL / JUP / PYTH** | Core DeFi & Oracle Infrastructure | Live Market Feed |

---

## 💼 White-Label Monetization & Licensing Structures

This dApp architecture is pre-configured to support 5 commercial software tiers:

1.  **Entry / Viral Launch ($499):** AMM Swap + Affiliate System (Perfect for micro-cap meme coins needing rapid volume acceleration).
2.  **Token Velocity ($1,299):** AMM Swap + Yield Optimizer + Affiliate (Our most popular package to mitigate heavy market sell-offs).
3.  **Whale Retention Suite ($1,199):** Token Locker Hub + Real Yield USDC Pool + Affiliate (Engineered to lock up circulating supply).
4.  **Safe Staking Hub ($1,099):** Yield Optimizer + Token Locker Hub (A pure DeFi asset management platform).
5.  **Ultimate DeFi Suite ($2,499):** Complete unhindered access to all 4-in-1 core modular feature sets.

---

## 🛠️ Local Installation & Development

Ensure you have [Node.js](https://nodejs.org/) installed on your machine before running the setup commands.

1.  **Clone the Repository:**
```bash
    git clone [https://github.com/username/zoniqfi-hub.git](https://github.com/username/zoniqfi-hub.git)
    cd zoniqfi-hub
    ```

2.  **Install Dependencies:**
```bash
    npm install
    ```

3.  **Launch the Local Development Server:**
```bash
    npm run dev
    ```
    The application will now be live at `http://localhost:5173`.

4.  **Testing Modular Package Queries:**
    Append the query strings to your local URL to test the responsive visual parameters for each package tier:
    * `http://localhost:5173/?pkg=entry`
    * `http://localhost:5173/?pkg=velocity`
    * `http://localhost:5173/?pkg=whale`
    * `http://localhost:5173/?pkg=staking`

---

## 🌐 Production & Vercel Deployment Ready

This dApp frontend code is fully optimized to ensure a **100% Successful Build Pass** on platforms like Vercel or Netlify. All broken external image references have been thoroughly sanitized to preserve a clean, modern, high-end Web3 UI/UX aesthetic.

* **Default Network Cluster:** `Solana Devnet` (Prevents real SOL gas-fee burn during the client sales pitch and demo phase).
* **Mainnet Migration:** Simply switch the string variable parameter `SOLANA_NETWORK` from `"devnet"` to `"mainnet-beta"` in the root config file once your client is ready to launch their token ecosystem live.

---

© 2026 ZoniqFi. All Rights Reserved. Premium Solana Software-as-a-Service (SaaS) Infrastructure.