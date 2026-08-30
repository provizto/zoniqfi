# ⚡ ZoniqFi Protocol — Modular Solana DeFi Suite & Real-Yield Infrastructure

[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet%20Verified-14F195?logo=solana&logoColor=white)](https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet)
[![Live Sandbox Preview](https://img.shields.io/badge/Live%20Demo-vzt--beige.vercel.app-0284c7)](https://vzt-beige.vercel.app)
[![Telegram Support](https://img.shields.io/badge/Telegram-Core%20Dev-229ED9?logo=telegram&logoColor=white)](https://t.me/zoniqfi)

**ZoniqFi Protocol** is an enterprise-grade, modular DeFi infrastructure engineered on Solana. Leveraging **Solana Versioned Transactions (v0 / ALTs)**, **Jito Block Engine Anti-MEV routing**, and **Solana Name Service (SNS)** identity resolution, ZoniqFi provides a turnkey DeFi execution layer designed to capture protocol revenue and distribute non-inflationary **USDC Real Yield** to ecosystem participants.

---

## 🏛️ Core Architectural Modules

[ Solana Versioned Transaction Pipeline (Compact ALTs Engine) ]
│
├── 1. Security & Pre-Execution Validation
│   ├── Jito Engine Private Bundle Routing (Anti-Sandwich / MEV Defense)
│   ├── Anti-Wash Trading Rate-Limiting (Max 1 tx / 10s per PDA)
│   └── SNS Identity Resolver (.sol & .sns Domain Normalization)
│
├── 2. Liquidity & Dynamic Settlement Core
│   ├── Dynamic SPL Token Swap Execution (Jupiter Price API v2)
│   └── 0.3% Flat Protocol Fee Assessment (Settled Atomically in USDC)
│
└── 3. Atomic Multi-Tier Fee Routing
├── 40% ➔ Yield Optimizer Vault (Auto-Compounding APY up to 49.1%)
├── 30% ➔ $ZQI Real Yield Staking Pool (USDC Staking Dividends)
├── 15% ➔ Anti-Sybil Affiliate Treasury (Tiered Community Rebates)
└── 15% ➔ Operations Treasury (Dedicated RPC & Node Maintenance)

### 1. AMM DEX Swap Engine (Anti-MEV Atomic Swaps)
* **Atomic Execution:** Powered by Solana Transaction v1 (up to 4,096-byte payload capacity).
* **MEV Elimination:** Routes swap instructions through Jito Block Engine private bundles to mitigate front-running and predatory sandwich bots.
* **Fee Capitalization:** A flat 0.3% protocol fee is atomically distributed to protocol vaults without native token emission inflation.

### 2. Yield Optimizer Vault (Automated Compounding)
* **Non-Custodial Architecture:** Single-deposit USDC architecture executing periodic programmatic rebalancing.
* **Performance:** Baseline 0.11% daily rate with dynamic boosted optimizations up to 49.1% APY.

### 3. $ZQI Supply Lock & Real Yield Engine
* **Circulating Supply Defense:** Staking horizons with weighted reward multipliers:
  * **30 Days:** 1.0x Weight
  * **90 Days:** 1.5x Weight
  * **180 Days:** 2.5x Weight
* **Deflationary Burn Mechanism:** Premature early exits (*Emergency Unlock*) trigger a mandatory 10% penalty permanently burned on-chain.
* **0% Inflation:** All staking rewards are settled and distributed strictly in stable USDC.

### 4. Secure On-Chain Affiliate Engine
* **Web3 Identity:** Integrated domain resolution for Solana Name Service (`.sol` / `.sns`).
* **Anti-Sybil Engine:** Embedded on-chain rate limits (1 tx / 10s threshold) mitigating multi-wallet manipulation.
* **Tiered Rebates:** Bronze (10% on $0–$10k), Silver (18% on $10k–$100k), and Gold (25% on >$100k volume).

---

## 📊 Protocol Specifications & Status

| Parameter | Technical Standard | Status |
| :--- | :--- | :--- |
| **Network Cluster** | Solana Devnet (Staging) ➔ Mainnet-Beta (Q1 2027) | Verified & Active |
| **Live Sandbox Deployment** | [vzt-beige.vercel.app](https://vzt-beige.vercel.app) | Live Preview Active |
| **Smart Contract Program ID** | [`HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD`](https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet) | Executable (BPF Upgradeable) |
| **Transaction Standard** | Solana Versioned Transactions (v0 / ALTs) | Verified |
| **Oracle & Pricing** | Jupiter Price Engine v2 Integration | Real-time Stream |
| **Identity Standard** | Solana Name Service (SNS) Parser | Verified |

---

## 🛠️ Local Development Setup

Ensure you have **Node.js (v18+)** and **npm** installed.

```bash
# 1. Clone repository
git clone [https://github.com/zoniqfi/zoniqfi-protocol.git](https://github.com/zoniqfi/zoniqfi-protocol.git)
cd zoniqfi-protocol

# 2. Install dependencies
npm install

# 3. Launch development server
npm run dev

The dApp sandbox will be accessible locally at http://localhost:5173.

🗺️ Milestone Roadmap & Capital Allocation
Phase 1 (Q3 2026 — Current): Devnet Sandbox, multi-wallet standard integration (Phantom, Solflare, OKX, Coinbase, Backpack, Ledger), and SNS resolver.

Phase 2 (Q4 2026 — Target: $40k–$60k): Formal smart contract security audit (OtterSec / Sec3 / Kudelski), Anchor PDA account migration, and Dedicated RPC cluster setup.

Phase 3 (Q1 2027 — Target: $100k–$150k): Solana Mainnet-Beta deployment, Protocol-Owned Liquidity (POL) seeding, and live USDC Real Yield activation.

Phase 4 (Q2–Q3 2027 — Target: $50k–$80k): B2B White-Label Turnkey Gateway, developer SDK release, and institutional merchant expansion in Singapore/Southeast Asia.

📄 Compliance & Regulatory Notice
$ZQI functions strictly as a protocol utility, governance, and fee-capture asset. It does not constitute a security, collective investment scheme (CIS), or consumer digital payment token under MAS regulatory frameworks. All testing interactions are strictly isolated to the Solana Devnet cluster.

✉️ Institutional Inquiries & Grants
Lead Architect: @zoniqfi

Live Sandbox dApp: https://vzt-beige.vercel.app

Official Channel: t.me/zoniqfi

© 2026 ZoniqFi Protocol. All Rights Reserved.