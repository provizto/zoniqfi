# ⚡ ZoniqFi Protocol — Technical Architecture & Protocol Specification

Welcome to the official technical documentation and architecture repository for **ZoniqFi Protocol**.

ZoniqFi is an institutional-grade, modular DeFi infrastructure protocol architected natively for the Solana blockchain. Built with Anchor/Rust and leveraging **Solana Transaction v1 (4,096-byte atomic payload)**, the protocol integrates **Jito Block Engine private bundle routing (Anti-MEV)**, an autonomous **USDC single-asset Yield Optimizer**, a deflationary **$ZQI Real Yield Lock**, and an **SNS-integrated Tiered On-Chain Referral Engine**.

---

## 🏛️ Core Protocol Architecture & Fee Routing

ZoniqFi resolves toxic MEV extraction (sandwich/front-running attacks) and token emission inflation through an atomic, fee-capitalized economic flywheel.

```text
                  [ Solana Transaction v1 ]
                  (4,096-Byte Atomic Tx)
                             │
                             ▼
              [ Jito Block Engine Routing ]
               (Anti-MEV Private Bundle)
                             │
                             ▼
              [ 0.3% Flat Protocol Fee ]
                             │
       ┌─────────────┬───────┴─────┬─────────────┐
       ▼             ▼             ▼             ▼
    [ 40% ]       [ 30% ]       [ 15% ]       [ 15% ]
  Yield Vault    $ZQI Lock     Affiliate    Operations
 (Compounding)  (Real Yield)   Treasury    & Core Dev
```

---

## 🚀 The 4 Core DeFi Infrastructure Modules

### 1. AMM DEX Swap Engine (Anti-MEV Atomic Execution)
* **Solana Transaction v1 (Versioned Tx):** Packs complex verification, swap routing, and multi-vault distributions into a single 4,096-byte atomic payload.
* **Jito Block Engine Private Bundles:** Routes transactions directly to validators, completely bypassing the public mempool to eliminate front-running and sandwich bots.
* **Anti-Wash Trading Protection:** Programmatic on-chain cooldown limits prevent artificial volume inflation.
* **0.3% Flat Protocol Fee:** Split atomically across Yield Vaults (40%), $ZQI Real Yield Pool (30%), Affiliate Treasury (15%), and Project Operations (15%).

### 2. Yield Optimizer Vault (Automated Compounding)
* **Single-Deposit USDC Liquidity:** Eliminates impermanent loss risk through deterministic single-asset staking strategies.
* **Autonomous Execution:** Periodically executes auto-compounding cycles via non-custodial smart contracts without requiring user-side gas expenditure.
* **Deterministic Yield Engine:** Baseline programmatic daily rate of 0.11% with boosted optimizations reaching up to **49.1% APY**.

### 3. $ZQI Lock & Real Yield (Deflationary Supply Defense)
* **0% Inflation Real Yield:** Staking rewards are distributed strictly in stable **USDC** derived from protocol swap fees, avoiding secondary market sell pressure from token emissions.
* **Lock Multipliers & Reward Weights:**
  * **30-Day Horizon:** 1.0x Reward Multiplier
  * **90-Day Horizon:** 1.5x Reward Multiplier
  * **180-Day Horizon:** 2.5x Reward Multiplier
* **Deflationary Burn Defense:** Premature emergency unlocks trigger a mandatory **10% penalty burned permanently on-chain**.

### 4. Secure On-Chain Affiliate (SNS-Integrated Referral)
* **Solana Name Service Support:** Natively resolves human-readable domain identities (.sol / .sns) alongside raw Public Keys.
* **URL Parsing & Self-Referral Prevention:** Programmatic query handling (?ref=) with automated rejection of self-referral transactions.
* **Anti-Sybil Cooldown Engine:** Enforces a strict rate limit (1 transaction per 10 seconds) to prevent multi-wallet bot manipulation.
* **3-Tier Volume Rebates:**
  * **Bronze Tier ($0 – $10,000 Volume):** 10% Commission Rebate
  * **Silver Tier ($10,001 – $100,000 Volume):** 18% Commission Rebate
  * **Gold Tier (> $100,000 Volume):** 25% Commission Rebate

---

## 🔄 Self-Sustaining Economic Flywheel

1. **Traffic & Referral Inflow:** The On-Chain Affiliate engine incentivizes creators, referrers, and merchants to drive swap volume into the protocol.
2. **Fee Capitalization:** Every transaction charges a 0.3% fee collected directly as stable USDC revenue, completely bypassing token inflation.
3. **Supply Lock & Deflation:** Users lock $ZQI to capture 30% of protocol fees in USDC dividends. Early exits trigger a 10% burn, permanently reducing circulating supply.
4. **Compounding Liquidity:** 40% of swap fees feed the Yield Vault, continuously boosting APY and protocol-locked TVL.

---

## 🗺️ Roadmap & Capital Milestones

### Phase 1 • Q3 2026 (Current Execution)
* **Status:** Bootstrapped (MVP Live on Devnet)
* Deployment of all 4 modular smart contracts on Solana Devnet.
* Solana Wallet Standard integration (Phantom, Solflare, Backpack, OKX, Coinbase, Ledger).
* SNS domain resolution engine integration.

### Phase 2 • Q4 2026 (Audit & Anchor PDA Migration)
* **Target Capital:** $40,000 – $60,000
* Third-party smart contract security audit (OtterSec / Kudelski / Sec3).
* Transition to full production Anchor Program Derived Addresses (PDA).
* Dedicated high-throughput RPC cluster deployment.

### Phase 3 • Q1 2027 (Mainnet-Beta Launch & Liquidity)
* **Target Capital:** $100,000 – $150,000
* Solana Mainnet-Beta protocol deployment.
* Protocol-Owned Liquidity (POL) injection for $ZQI/USDC and $ZQI/SOL pairs.
* Activation of live 0.3% fee-to-USDC yield distribution engine.

### Phase 4 • Q2–Q3 2027 (B2B Infrastructure & Regional Expansion)
* **Target Capital:** $50,000 – $80,000
* Deployment of turnkey B2B white-label infrastructure and developer SDKs.
* Institutional merchant and partner onboarding in Singapore and Southeast Asia.

---

## 📊 Capital Allocation Framework (Use of Funds)

| Category | Allocation | Strategic Objective |
| :--- | :--- | :--- |
| **Smart Contract Audits** | **35%** | Formal code verification, penetration testing, and vulnerability remediation. |
| **Protocol Liquidity (POL)** | **30%** | Seeding primary DEX liquidity pools to ensure minimal slippage. |
| **Core Engineering** | **20%** | Dedicated RPC node cluster, Jito relayer gas fees, and Rust smart contract maintenance. |
| **Institutional BizDev** | **15%** | Regional merchant onboarding, compliance, and legal framework setup. |

---

## 💻 Local Development & Testing

### Prerequisites
* Node.js (v18.x or later)
* Rust & Cargo
* Solana CLI (v1.18+)
* Anchor Framework (v0.29+)

### Installation & Commands

```bash
git clone https://github.com/provizto/zoniqfi.git
cd zoniqfi
npm install
anchor build
anchor test
npm run dev
```

---

## 🔗 Official Verification Links

* Live dApp (Solana Devnet): https://zoniqfi.com
* Smart Contract Repository: https://github.com/provizto/zoniqfi
* Technical Documentation: https://github.com/provizto/zoniqfi-docs
* Direct Engineering Channel: https://t.me/zoniqfi

---

© 2026 ZoniqFi Protocol. All Rights Reserved. Built for the Solana Ecosystem.
