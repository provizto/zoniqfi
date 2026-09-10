# ⚡ ZoniqFi Protocol — Technical Architecture & Protocol Specification

Welcome to the official technical documentation and architecture repository for **ZoniqFi Protocol**.

> *"ZoniqFi ($ZQI) — The native governance & yield-bearing utility token powering decentralized PayFi settlements on Solana."*

ZoniqFi is an institutional-grade, modular DeFi & PayFi infrastructure protocol architected natively for the Solana blockchain. Built with Anchor/Rust and leveraging **Solana Transaction v1 (4,096-byte atomic payload)**, the protocol integrates **Jito Block Engine private bundle routing (Anti-MEV)**, an autonomous **USDC single-asset Yield Optimizer**, an epoch-based deflationary **$ZQI Real Yield Lock**, an **SNS-integrated Tiered On-Chain Referral Engine**, and a non-custodial **PayFi Digital Core Commerce Engine** powered by Direct QRIS and an automated **Solana Prepaid Gas Tank**.

---

## 🏛️ Core Protocol Architecture & Dual-Flow Routing

ZoniqFi resolves toxic MEV extraction (sandwich/front-running attacks) and token emission inflation through an atomic, fee-capitalized economic flywheel combining AMM DEX swaps with real-world PayFi commercial checkouts.

```text
                      [ ZoniqFi Transaction Pipeline ]
                                     │
          ┌──────────────────────────┴──────────────────────────┐
          ▼                                                     ▼
 [ AMM DEX Swap Engine ]                             [ PayFi Merchant Gateway ]
(Anti-MEV Private Bundle)                           (Direct QRIS Fiat Settlement)
          │                                                     │
          ▼                                                     ▼
[ 0.3% Flat Protocol Fee ]                           [ 100% Fiat Direct to Vendor ]
          │                                                     │
          │                                             [ Merchant SOL Gas Tank ]
          │                                            (5% Platform Cut Debited)
          │                                                     │
          │                                             [ Hard Gas Guardrail ]
          │                                            (Halts Checkout if 0 SOL)
          │                                                     │
          └──────────────────────────┬──────────────────────────┘
                                     │
                                     ▼
                  [ Solana On-Chain Atomic Fee Splitter ]
                      (sendRelayTransaction on Devnet)
                                     │
          ┌─────────────┬────────────┴───────────┬─────────────┐
          ▼             ▼                        ▼             ▼
       [ 40% ]       [ 30% ]                  [ 15% ]       [ 15% ]
     Yield Vault   $ZQI Lock                 Affiliate     Operations,
    (Compounding) (Real Yield)                Treasury    Gas Relayers
                                                           & Core Dev
```

---

## ⚠️ Problem Statement & Market Inefficiencies

* **Onboarding & Gas Friction for Merchants:** Web2 creators and retail merchants in emerging markets cannot navigate complex token swaps, crypto price volatility, or gas management simply to accept customer payments.
* **Pervasive MEV Exploitation:** Arbitrage and sandwich bots in public mempools extract substantial value from retail DEX traders.
* **Custodial Intermediary Risk:** Centralized payment gateways charge heavy fees (2%–4%) and impose multi-day settlement clearance delays on merchant revenue.
* **Hyper-Inflationary Farm Vulnerabilities:** Traditional AMMs rely on inflationary token emissions rather than sustainable, counter-cyclical retail fee cashflows.

---

## 🚀 The 5 Core DeFi & PayFi Infrastructure Modules

### 1. AMM DEX Swap Engine (Anti-MEV Atomic Execution)
* **Solana Transaction v1 (Versioned Tx):** Packs transaction verification, dynamic price routing, and multi-vault distributions into a single 4,096-byte atomic payload.
* **Jito Block Engine Private Bundles:** Routes swap transactions directly to validators, completely bypassing the public mempool to eliminate front-running and sandwich bot extraction.
* **Anti-Wash Trading Protection:** Programmatic on-chain cooldown limits prevent artificial volume wash-trading.
* **0.3% Flat Protocol Fee:** Split atomically across Yield Vaults (40%), $ZQI Real Yield Pool (30%), Affiliate Treasury (15%), and Project Operations (15%).
* **Vendor Gas Refill Bridge (Upcoming):** Integrated 1-Click Swap module embedded inside merchant dashboards, enabling vendors to instantly convert received stablecoins/SPL tokens into SOL gas tank fuel.

### 2. PayFi Digital Core (Direct QRIS & Prepaid Gas Tank Rails)
* **Zero-Custody Fiat Settlement:** 100% of customer fiat (QRIS) settles directly into the merchant's personal bank or e-wallet account (BCA, Mandiri, GoPay, OVO, DANA, ShopeePay) without intermediary escrow risk or clearance delay.
* **Solana Prepaid Gas Tank:** Merchants pre-fund an on-chain SOL gas deposit. Every verified sale debits a 5% protocol fee from the vendor's gas reserve, executed atomically across the 4 protocol treasury vaults.
* **Hard Gas Guardrail (Execution Circuit Breaker):** Built-in pre-execution validation checks the vendor's SOL gas balance before generating a sale. Checkouts are halted immediately if reserves drop below the 5% fee threshold.
* **Instant Digital License Delivery:** Secure download credentials (.zip/.pdf) and cryptographic license states are unlocked instantly upon fiat settlement confirmation.
* **Multi-Vertical Catalog Support:** Out-of-the-box infrastructure supporting 9 retail verticals ranging from Web3 digital collectibles and SaaS software to physical MSME products (RWA).

### 3. Yield Optimizer Vault (Automated Compounding)
* **Single-Deposit USDC Liquidity:** Eliminates impermanent loss risk through deterministic single-asset staking strategies.
* **Autonomous Execution:** Periodically executes auto-compounding cycles via non-custodial smart contracts without requiring user-side gas expenditure.
* **Deterministic Yield Engine:** Baseline programmatic daily yield rate of 0.11% with compounding yield models scaling up to **49.1% APY**.

### 4. $ZQI Lock & Real Yield (Deflationary Supply Defense)
* **0% Inflation Real Yield:** Staking rewards are distributed strictly in stable **USDC** derived from protocol swap fees and PayFi commercial volume, eliminating token emission dilution.
* **Epoch-Based Lock Multipliers:**
  * **7-Day Horizon:** 0.5x Reward Weight
  * **15-Day Horizon:** 0.75x Reward Weight
  * **30-Day Horizon:** 1.0x Reward Weight
  * **90-Day Horizon:** 1.5x Reward Weight
  * **180-Day Horizon:** 2.5x Reward Weight
* **Deflationary Burn Defense:** Premature emergency unlocks incur a mandatory **10% penalty burned permanently on-chain**.

### 5. Secure On-Chain Affiliate (SNS-Integrated Referral)
* **Solana Name Service Support:** Natively resolves human-readable domain identities (.sol / .sns) alongside raw public keys.
* **Dual-Action Referral Routing:** Supports automatic referral tracking via URL parameters (`?ref=`) and manual fallback referrer verification on-chain.
* **Anti-Sybil Cooldown Engine:** Enforces a strict 10-second cooldown per referral binding transaction to mitigate multi-wallet bot manipulation.
* **3-Tier Volume Rebates:**
  * **Bronze Tier ($0 – $10,000 Volume):** 10% Commission Rebate
  * **Silver Tier ($10,001 – $100,000 Volume):** 18% Commission Rebate
  * **Gold Tier (> $100,000 Volume):** 25% Commission Rebate

---

## 🔄 Self-Sustaining Economic Flywheel

1. **Zero-Friction Commercial Inflow:** Shoppers purchase digital or physical goods using standard fiat QRIS. Merchants receive 100% of fiat proceeds instantly without cryptocurrency onboarding friction.
2. **On-Chain Gas Capitalization:** The protocol debits the 5% platform fee in SOL directly from the merchant's Prepaid Gas Tank, splitting it on-chain across protocol vaults.
3. **Organic AMM DEX Demand:** Merchants replenish their SOL Gas Tank via the integrated AMM DEX Swap (1-Click Gas Refill), driving organic, recurring trading volume.
4. **Supply Compression & Real Yield:** 30% of all protocol fees flow directly into the $ZQI Lock Pool as USDC dividends, while emergency unlock penalties burn circulating supply permanently.
5. **Compounding Treasury Expansion:** 40% of fees feed the Yield Vault to deepen liquidity reserves, while 15% affiliate rebates incentivize creators and developers to onboard new merchants.

---

## 📑 Protocol Specifications & On-Chain Verification

| Component | Technical Implementation | Current On-Chain Status |
| :--- | :--- | :--- |
| **Transaction Standard** | Solana Transaction v1 (4,096-byte Atomic Payload) | Verified on Devnet |
| **$ZQI Token Mint** | [`6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz`](https://solscan.io/token/6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz?cluster=devnet) | Verified on Devnet (SPL Token) |
| **Smart Contract Program ID** | [`HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD`](https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet) | Executable (BPF Upgradeable) |
| **PayFi Settlement Rails** | Direct QRIS 100% fiat payout + Prepaid SOL Gas Tank debit (5%) with guardrail | Live Devnet Tested |
| **On-Chain Fee Relayer** | Atomic 4-way split to dedicated protocol vault addresses via Solana transactions | Operational & Verified |
| **DEX Swap Engine** | Anti-MEV private bundle execution with 0.3% protocol fee route | Functional Devnet Core |
| **Yield & Staking Engine** | Epoch-based Real Yield distribution funded by PayFi & DEX volume | Interactive Sandbox Demo |
| **Web3 Identity** | Solana Name Service (.sol & .sns) resolution with anti-sybil cooldown checks | Real-time RPC Lookup |

---

## 🗺️ Roadmap & Capital Tranches

ZoniqFi adopts a tranche-based, milestone-gated capital framework. Funding strictly matches verified engineering releases bridging Web2 fiat retail (Direct QRIS) with Solana on-chain liquidity.

### Phase 1 • Q3 2026 (Current Stage: Colosseum Sprint)
* **Status:** Tested & Operational (Solana Devnet)
* Deployment and validation of PayFi settlement engine: Direct QRIS checkout, merchant Prepaid Gas Tank, automated 4-way fee relayer, and hard execution guardrails.
* DEX Swap, Yield Optimizer, and Epoch Staking modules functional in interactive devnet sandbox.
* Multi-wallet adapter integration (Phantom, Solflare, Backpack, OKX) with real-time SNS (.sol / .sns) domain resolution.

### Phase 2 • Q4 2026: Anchor Fee Routing, Security Audits & Multisig
* **Target Capital:** $40,000 – $60,000

| Cost Item | Estimated Budget | Technical & Operational Justification |
| :--- | :--- | :--- |
| **Full-Suite Security Audit** | $28,000 – $38,000 | Engaging Solana security auditors (**OtterSec** or **Sec3**). Auditing all 5 modules (Swap, Lock, Vault, Affiliate, PayFi Gas Relayer) with focus on PDA seed safety, gas tank balance math, and early-unlock burn integrity. |
| **Anchor Fee Routing & 1-Click Refill** | $6,000 – $9,000 | Writing and deploying Anchor smart contracts to programmatically route the 30% PayFi fee split into the dApp Staking pool, alongside an embedded 1-Click AMM Swap widget inside merchant portals for automated SOL gas refills. |
| **Enterprise RPC Infrastructure** | $3,000 – $5,000 | 6-month prepaid commitment for dedicated enterprise RPC clusters (**Helius Enterprise** or **Triton One**) to guarantee high-throughput transaction broadcast reliability for both DEX trades and merchant checkout events. |
| **Squads Multisig Governance** | $3,000 – $8,000 | Deployment of Squads v4 multisig vault (3-of-5 threshold) for Program Upgrade Authority and treasury key management, combined with an initial bug bounty reserve. |

### Phase 3 • Q1 2027: Mainnet Deployment & Liquidity Seeding
* **Target Capital:** $100,000 – $150,000

| Cost Item | Estimated Budget | Financial & Balance Sheet Justification |
| :--- | :--- | :--- |
| **Protocol-Owned Liquidity (POL)** | $75,000 – $105,000 | **Balance Sheet Asset (Not Cash Burn):** Injected into paired AMM pools (**$ZQI/USDC** & **$ZQI/SOL**). Establishes deep market depth, stabilizes PayFi pricing rails, and accrues recurring LP swap fees to the treasury. |
| **Account Rent & Relayer Gas Reserves** | $8,000 – $15,000 | Solana account rent-exemption for merchant registries, SKU product state PDAs, and high-frequency fee distribution relayer reserves. |
| **Jito MEV-Protection Setup** | $5,000 – $10,000 | Direct integration with Jito Block Engine validator bundles to guarantee sandwich-free swap execution for protocol users and merchant payments. |
| **Merchant Acquisition & Launch Grants** | $12,000 – $20,000 | Targeted digital asset creator onboarding grants, promotional fee rebates for pilot merchants, and community growth campaigns. |

### Phase 4 • Q2–Q3 2027: B2B PayFi SDK & Regional Expansion
* **Target Capital:** $50,000 – $80,000

| Cost Item | Estimated Budget | Strategic Growth Justification |
| :--- | :--- | :--- |
| **B2B PayFi SDK & Merchant APIs** | $25,000 – $35,000 | Modular TypeScript/Rust SDKs and REST endpoints enabling external digital storefronts, SaaS platforms, and creator sites to embed ZoniqFi Direct QRIS and Gas Tank checkout natively. |
| **Regional Merchant BD (Indonesia & SEA)** | $15,000 – $25,000 | Onboarding regional creators, software developers, and digital publishers across Southeast Asian hubs to scale active merchant adoption. |
| **Compliance & Legal Structuring** | $10,000 – $20,000 | Formal legal structuring, utility token classification memorandum, and non-custodial PayFi regulatory advisory across target jurisdictions. |

---

## 📊 Capital Allocation Framework (Use of Funds)

| Category | Allocation | Strategic Objective |
| :--- | :--- | :--- |
| **Smart Contract Audits** | **35%** | Formal Anchor program verification, math audit, and penetration testing across all modules. |
| **Protocol Liquidity (POL)** | **30%** | Seeding primary AMM DEX liquidity pools ($ZQI/USDC & SOL) as permanent balance-sheet assets. |
| **Core Engineering & Infrastructure** | **20%** | Dedicated enterprise RPC nodes (Helius/Triton), high-availability gas balance relayers, and Jito bundle tips. |
| **Merchant Onboarding & BD** | **15%** | Creator onboarding grants, regional compliance structuring, and pilot merchant acquisition. |

---

## 🔍 Investor & Accelerator Due Diligence Defense

### Q1: Why does Phase 3 represent over 50% of the aggregate raise?
* **Defense:** Phase 3 funds are predominantly **Capital Expenditure (CapEx) rather than operational burn**. Up to 75% of Phase 3 is deployed directly into Protocol-Owned Liquidity (paired in USDC and SOL). This capital never leaves the protocol balance sheet; it stabilizes the token's market floor, supports low-slippage AMM swaps, and generates recurring LP trading fee revenue for the treasury.

### Q2: What strategic moat does the PayFi Gateway add compared to pure DEX competitors?
* **Defense:** Standalone AMMs depend entirely on volatile, speculative trading volume. ZoniqFi's PayFi engine connects Solana on-chain liquidity directly to real-world consumer commerce. Customers pay via Direct QRIS (100% fiat received instantly by merchants), while the 5% protocol fee is debited from the merchant's on-chain SOL Gas Tank. This captures sustainable, non-speculative on-chain fee cashflow regardless of macro market conditions.

### Q3: Why raise a lean $190k–$290k instead of a typical $1.5M+ pre-seed round?
* **Defense:** All core modules (Swap, Lock, Vault, Affiliate, and PayFi Gas Tank engine) are already operational and validated on Solana Devnet. Because baseline R&D is completed, we do not require bloated runway. Raising lean capital tied strictly to verifiable milestones minimizes token and equity dilution, maximizing upside for early accelerator backers.

### Q4: How is key mismanagement or "rug-pull" risk mitigated post-funding?
* **Defense:** In Phase 2, single-key deployer authority is permanently revoked. Program Upgrade Authority and treasury accounts are transferred to a **3-of-5 Squads v4 Multisig** composed of core developers, investor representatives, and independent technical advisors. No code update, fee redistribution, or liquidity withdrawal can execute unilaterally.

### Q5: How does the protocol sustain runway after Phase 4 without continuous fundraising?
* **Defense:** ZoniqFi operates a self-sustaining dual cashflow engine. In addition to the 0.3% flat DEX swap fee (with 15% routed to treasury), the PayFi engine captures continuous 5% protocol fees in SOL debited from active merchant gas reserves. This provides organic, ongoing cash flow to cover RPC costs, smart contract maintenance, and team growth.

---

## 💻 Local Development & Testing

### Prerequisites
* Node.js (v18.x or later)
* Rust & Cargo
* Solana CLI (v1.18+)
* Anchor Framework (v0.29+)

### Installation & Commands

```bash
git clone [https://github.com/provizto/zoniqfi.git](https://github.com/provizto/zoniqfi.git)
cd zoniqfi
npm install
anchor build
anchor test
npm run dev
```

---

## 🔗 Official Verification Links

* **Live dApp (Solana Devnet):** https://zoniqfi.com
* **$ZQI Token Mint (Devnet):** https://solscan.io/token/6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz?cluster=devnet
* **Smart Contract / Program Authority:** https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet
* **Smart Contract Repository:** https://github.com/provizto/zoniqfi
* **Technical Documentation:** https://github.com/provizto/zoniqfi-docs
* **Direct Engineering Channel:** https://t.me/zoniqfi

---

*© 2026 ZoniqFi Protocol. All Rights Reserved. Built for the Solana Ecosystem.*