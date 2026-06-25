# ⚡ ZoniqFi Hub — Premium Solana White-Label dApp Infrastructure

Welcome to the official technical specification and deployment portal for the **ZoniqFi Hub**. This premium, turnkey dApp infrastructure is engineered specifically for the Solana blockchain. Built using React, Vite, and fully integrated with the **Jupiter Price API v2** and **Jito MEV-Protection Engine**, this repository provides a high-performing utility suite for project owners and token creators looking to supercharge holder retention, accelerate trading volume, and establish a real ecosystem within 24 hours.

As the core developer of this protocol, I offer flexible, enterprise-grade software licenses tailored to your tokenomics and community scale.

---

## 🚀 Key Features & Modular Architecture (Devnet Verified)

The application utilizes an intelligent, built-in **Package Detection Engine** driven by URL parameters (`?pkg=...`). This allows you to pick, choose, and unlock specific modular layers according to your operational budget and community roadmap:

### 1. AMM DEX Swap (Anti-MEV Secure)
* **Live Price Feeds:** Automatically syncs real-time market rates every 30 seconds by leveraging Solana's premier liquidity aggregator (Jupiter API v2).
* **Jito MEV Shield:** Shields retail traders from malicious front-running and sandwich bots using simulated Jito private transaction bundles.
* **Anti-Wash Trading:** Embedded internal algorithms to track daily transaction cycles, protecting your charts from artificial volume manipulation.

### 2. Yield Optimizer Vaults
* **Auto-Compounding Logic:** Automated asset management protocol offering optimized daily yield simulations (up to 0.11% daily / 49.1% APY).
* **Global Trust & Social Proof:** Integrated real-time tracking of Global Vault TVL and Active Depositors counters to foster instant credibility.
* **Interactive Forecast Calculator:** An embedded projection panel (Daily, Monthly, Annual metrics) designed to gamify user interaction and incentivize long-term asset locking.

### 3. ZQI Lock & Yield Hub
* **Cryptographic Staking Epoch:** A secure on-chain locking mechanism for the custom native utility token **$ZQI** bound to a 7-day epoch horizon.
* **Real Yield Distribution:** Staking rewards are accrued and paid out in stablecoins (USDC), completely mitigating selling pressure on your primary project token.
* **Deflationary Burn Penalty:** Strict protocol enforcement where premature vault unlocks incur a mandatory 10% deflationary supply burn penalty.

### 4. Tiered On-Chain Affiliate (Referral System)
* **Sybil Attack Prevention:** Imposes a strict cooldown rate-limit (maximum 1 transaction per 10 seconds) to completely block multi-wallet bot manipulation.
* **Transparent Commissions Display:** Real-time calculation showing exact claimable USDC commission earnings alongside network volume.
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

## 💼 Available Licensing Tiers

I offer 5 standalone and combined licensing options depending on your token's immediate objectives:

1.  **Entry / Viral Launch ($499):** AMM Swap + Affiliate System (Perfect for micro-cap meme coins needing rapid volume acceleration).
2.  **Token Velocity ($1,299):** AMM Swap + Yield Optimizer + Affiliate (Our most popular package to mitigate heavy market sell-offs).
3.  **Whale Retention Suite ($1,199):** Token Locker Hub + Real Yield USDC Pool + Affiliate (Engineered to lock up circulating supply).
4.  **Safe Staking Hub ($1,099):** Yield Optimizer + Token Locker Hub (A pure DeFi asset management platform).
5.  **Ultimate DeFi Suite ($2,499):** Full, unhindered access to all 4-in-1 core modular feature sets for complete ecosystem dominance.

---

## Total Cost of Ownership (TCO) Overview

================================================================================
           ZONIQFI ECOSYSTEM INFRASTRUCTURE — COST DISCLOSURE FORM
================================================================================

[ CLIENT & PROJECT DETAILS ]
• Client / Team Name: __________________________________________________
• Primary Token Ticker: ________________________________________________
• Target Deployment Domain: ____________________________________________

--------------------------------------------------------------------------------
1. CORE CORE CORE CORE PLATFORM LICENSE FEE (Paid to ZoniqFi Team)
--------------------------------------------------------------------------------
[ ] Entry / Viral Launch Suite                 : $499.00
[ ] Token Velocity Bundle (3-in-1)             : $1,299.00
[ ] Whale Retention Suite                      : $1,199.00
[ ] Safe Staking Hub                           : $1,099.00
[ ] Ultimate DeFi Suite (4-in-1)               : $2,499.00

* Payment Terms: 50% Upfront Deposit ($_________) | 50% Upon Devnet Delivery ($_________)
* Accepted Method: USDC / SOL via Solana Network

--------------------------------------------------------------------------------
2. INTERNAL DEVELOPMENT & SETUP CHARGES (Paid to ZoniqFi Team)
--------------------------------------------------------------------------------
• Custom Visual UI Rebranding Fee              : INCLUDED in Package
• Initial Server Routing & Setup (Vercel/DNS)  : INCLUDED in Package
• Post-Launch Technical Support (First 14 Days) : FREE / INCLUDED
[ ] Optional Monthly Maintenance Retainer      : $99.00 / month (Optional Add-on)

--------------------------------------------------------------------------------
3. ESTIMATED EXTERNAL OPERATION COSTS (Third-Party / Client's Expense)
--------------------------------------------------------------------------------
The client must fund these directly using their operational wallet/accounts:
• Custom Domain Registration (.com/.xyz/.io)  : ~$10.00 – $40.00 / year
• Solana On-Chain Storage Rent (Rent-Exempt)   : ~0.10 – 1.50+ SOL (One-time, Reclaimable)
• Raydium/Orca Liquidity Pool Creation Fee     : ~0.20 – 2.00 SOL (Solana Network Fee)
• Production-Grade RPC Node (Helius/QuickNode) : Free tier baseline / Premium at $49.00/mo

--------------------------------------------------------------------------------
TOTAL PROJECT EST. INITIAL CAPITAL: $_____________ + (~2.5 SOL Network Reserve)
--------------------------------------------------------------------------------

By proceeding with the upfront deposit, the client acknowledges the pricing layout 
and agrees to provide the required third-party operational assets when requested.

Authorized Developer Signature: [ ZoniqFi Core ]
Client Confirmation Sign/Date : _______________________________________________

## 🛠️ Deployment & White-Label Delivery

Upon purchase of a software license, I handle the execution and delivery process:

* **Frontend Customization:** I will fully rebrand the dApp with your token name, logos, custom tickers, color schemes, and official project links.
* **Domain Routing:** The functional dApp will be deployed to your custom domain or subdomain (e.g., `swap.yourtoken.com`).
* **Devnet Testing Environment:** By default, your preview build will be launched on **Solana Devnet** to ensure extensive bug-free validation without burning real SOL transaction fees.
* **Mainnet Switchover:** When you are ready to go live, the core network parameter can be migrated from `"devnet"` to `"mainnet-beta"` inside the configuration file with a single line change.

---

## 🛠️ Local Installation & Development

Ensure you have [Node.js](https://nodejs.org/) installed on your machine before running the setup commands.

1.  **Clone the Repository:**
```bash
    git clone [https://github.com/provizto/zoniqfi.git](https://github.com/provizto/zoniqfi.git)
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
    The application will now be live at `https://zoniqfi.com`.

4.  **Testing Modular Package Queries:**
    Append the query strings to your local URL to test the responsive visual parameters for each package tier:
    * `https://entry.zoniqfi.com/?pkg=entry`
    * `https://velocity.zoniqfi.com/?pkg=velocity`
    * `https://whale.zoniqfi.com/?pkg=whale`
    * `https://staking.zoniqfi.com/?pkg=staking`

---

## 🌐 Production & Vercel Deployment Ready

This dApp frontend code is fully optimized to ensure a **100% Successful Build Pass** on platforms like Vercel or Netlify. All broken external image references have been thoroughly sanitized to preserve a clean, modern, high-end Web3 UI/UX aesthetic.

* **Default Network Cluster:** `Solana Devnet` (Prevents real SOL gas-fee burn during the client sales pitch and demo phase).
* **Mainnet Migration:** Simply switch the string variable parameter `SOLANA_NETWORK` from `"devnet"` to `"mainnet-beta"` in the root config file once your client is ready to launch their token ecosystem live.

---

## ✉️ Acquire A License

Ready to elevate your token utility ecosystem? Contact me directly via the official Telegram channel to consult on your deployment parameters, verify custom features, and acquire your commercial dApp license.

* **Official Contact:** [@zoniqfi](https://t.me/zoniqfi)

---

© 2026 ZoniqFi. All Rights Reserved. Premium Solana Software-as-a-Service (SaaS) Infrastructure.