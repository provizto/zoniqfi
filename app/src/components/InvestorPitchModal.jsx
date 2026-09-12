import React, { useState, useEffect } from 'react';

const TABS = [
  { id: 'modules', label: 'Core Modules (DeFi + PayFi)' },
  { id: 'roadmap', label: 'Roadmap & Milestones' },
  { id: 'flywheel', label: 'Economic Flywheel' }
];

const PAYFI_CATEGORIES = [
  { icon: "💎", name: "NFT & Web3 Collectibles" },
  { icon: "💻", name: "Software & Source Code" },
  { icon: "📚", name: "E-Books & Educational Docs" },
  { icon: "🎨", name: "Design, UI/UX & 3D Assets" },
  { icon: "🔑", name: "Licenses & Digital Accounts" },
  { icon: "🛠️", name: "Digital Services & Freelance" },
  { icon: "👕", name: "Fashion & Merchandise" },
  { icon: "📱", name: "Gadgets & Hardware Tech" },
  { icon: "📦", name: "Physical Goods & MSMEs (RWA)" }
];

const InvestorPitchModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('modules');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
        padding: '16px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0b1326',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '20px',
          maxWidth: '880px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.08)',
          overflow: 'hidden',
          color: '#f3f4f6',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* MODAL HEADER */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#080d1a',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', color: '#38bdf8' }}>⚡</span>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.15rem', 
                fontWeight: '800', 
                letterSpacing: '0.3px', 
                color: '#ffffff'
              }}>
                ZoniqFi Protocol Pitch & Institutional Brief
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              Hybrid Web3 DeFi + Real-World PayFi Commerce Engine (Solana Architecture)
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#cbd5e1',
              fontSize: '1.25rem',
              cursor: 'pointer',
              width: '34px',
              height: '34px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            &times;
          </button>
        </div>

        {/* UNIFIED SEGMENTED TAB TRACK */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #1e293b',
          background: '#070c18'
        }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '4px',
            gap: '6px'
          }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    height: '38px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                    border: 'none',
                    boxShadow: isActive ? '0 2px 10px rgba(59, 130, 246, 0.4)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, fontSize: '0.9rem', lineHeight: '1.6' }}>
          
          {/* TAB 1: CORE DEFI & PAYFI MODULES */}
          {activeTab === 'modules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* PayFi Spotlight Module */}
              <div style={{ 
                background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(17, 24, 39, 1) 100%)', 
                border: '1px solid rgba(245, 158, 11, 0.35)', 
                borderRadius: '12px', 
                padding: '16px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <h4 style={{ margin: 0, color: '#fbbf24', fontSize: '1.02rem', fontWeight: '800' }}>
                    01. PayFi Gateway & Merchant Commerce (Direct QRIS + Prepaid Gas Tank)
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>
                    LIVE RELAY TESTED
                  </span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '0.85rem' }}>
                  Non-custodial PayFi rails bridging fiat retail with Solana. Merchants receive 100% fiat payouts directly via personal QRIS, while a Solana-native Prepaid Gas Tank debits protocol fees automatically.
                </p>

                {/* 9 Category Scaffolding */}
                <div style={{ 
                  background: 'rgba(0, 0, 0, 0.3)', 
                  border: '1px solid #1e293b', 
                  borderRadius: '8px', 
                  padding: '10px 12px',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Supported Merchant Categories:
                  </span>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                    gap: '6px', 
                    marginTop: '8px' 
                  }}>
                    {PAYFI_CATEGORIES.map((cat, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                  <li><strong>Zero-Custody Direct Settlement:</strong> 100% of customer fiat (QRIS) settles directly to the merchant's bank/e-wallet without platform escrow delay.</li>
                  <li><strong>Automated Solana Fee Split:</strong> 5% protocol fee is debited from merchant's SOL gas reserve and split on-chain: 40% Yield Vault, 30% Real Yield Pool, 15% Affiliate, 15% Ops.</li>
                  <li><strong>Hard Gas Guardrail:</strong> Built-in execution circuit breaker rejects checkouts instantly if the vendor's SOL gas reserve drops below the required fee threshold.</li>
                </ul>
              </div>

              {/* Swap Engine */}
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '1rem', fontWeight: '700' }}>
                    02. AMM DEX Swap Engine (Anti-MEV Atomic Swaps)
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>TX V1 ATOMIC</span>
                </div>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  High-velocity decentralized exchange utilizing Solana Transaction v1 with sub-400ms finality. Features Jito Block Engine bundle integration for strict anti-front-running protection.
                </p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                  <li><strong>MEV Mitigation:</strong> Eliminates sandwich attacks and front-running across all devnet/mainnet swaps.</li>
                  <li><strong>Vendor Refill Bridge (Upcoming):</strong> 1-Click Swap embedded in vendor portals to let merchants convert stablecoins directly to SOL gas fuel.</li>
                </ul>
              </div>

              {/* Lock & Staking */}
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <h4 style={{ margin: 0, color: '#c084fc', fontSize: '1rem', fontWeight: '700' }}>
                    03. $ZQI Lock & Real Yield (Deflationary Supply Defense)
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>DEMO EPOCH READY</span>
                </div>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  Lock mechanism mitigating secondary market selling pressure by distributing Real Yield in stable USDC dividends, designed to capture fees from both AMM swaps and PayFi merchant volume.
                </p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                  <li><strong>Lock Multipliers:</strong> 7 Days (0.5x), 15 Days (0.75x), 30 Days (1.0x), 90 Days (1.25x), and 180 Days (2.5x share weight).</li>
                  <li><strong>Deflationary Burn:</strong> Mandatory 10% penalty on emergency unlock designed for permanent on-chain token burn.</li>
                </ul>
              </div>

              {/* Yield Optimizer Vault */}
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <h4 style={{ margin: 0, color: '#60a5fa', fontSize: '1rem', fontWeight: '700' }}>
                    04. Yield Optimizer Vault (Automated Compounding)
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>NON-CUSTODIAL</span>
                </div>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  Automated compounding yield generation tailored for USDC single-deposit liquidity with baseline projected daily returns reaching up to 49.1% APY.
                </p>
              </div>

              {/* Affiliate */}
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <h4 style={{ margin: 0, color: '#4ade80', fontSize: '1rem', fontWeight: '700' }}>
                    05. Secure On-Chain Affiliate (SNS-Integrated Referral)
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>ANTI-SYBIL</span>
                </div>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  Decentralized growth infrastructure distributing tiered commission rebates (10% to 25%) backed by Solana Name Service (.sol) support and automated anti-sybil cooldowns.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: ROADMAP & FUNDING */}
          {activeTab === 'roadmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ borderLeft: '3px solid #14b8a6', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: '700' }}>PHASE 1 • Q3 2026 (CURRENT STAGE)</span>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
                    Tested on Devnet
                  </span>
                </div>
                <h4 style={{ margin: '4px 0 6px 0', color: '#fff', fontSize: '0.95rem' }}>PayFi Engine & Multi-Module Core Deployment</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                  Validation of Direct QRIS payouts, Solana Prepaid Gas Tank, automated 4-way protocol fee relayer, and guardrails. AMM Swap, Vault, and Staking interfaces fully operational in devnet sandbox.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '700' }}>PHASE 2 • Q4 2026</span>
                  <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Target: $40,000 - $60,000</span>
                </div>
                <h4 style={{ margin: '4px 0 6px 0', color: '#fff', fontSize: '0.95rem' }}>Anchor Smart Contract Routing & 1-Click Refill</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                  Deploying Solana Anchor contracts to programmatically route PayFi treasury splits directly into dApp Staking pools. Integrating 1-Click AMM Swap inside merchant portals for automated gas refills and Squads v4 multisig governance.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: '700' }}>PHASE 3 • Q1 2027</span>
                  <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Target: $100,000 - $150,000</span>
                </div>
                <h4 style={{ margin: '4px 0 6px 0', color: '#fff', fontSize: '0.95rem' }}>Mainnet Deployment & Protocol-Owned Liquidity (POL)</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                  Formal smart contract audit completion (OtterSec/Sec3), full Solana Mainnet release, initial POL seeding for $ZQI pairs, and activation of on-chain real yield distribution.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #ec4899', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: '700' }}>PHASE 4 • Q2-Q3 2027</span>
                  <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Target: $50,000 - $80,000</span>
                </div>
                <h4 style={{ margin: '4px 0 6px 0', color: '#fff', fontSize: '0.95rem' }}>Enterprise PayFi SDK & SEA Expansion</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                  Modular TypeScript/Rust SDKs and no-code plugins (Shopify/WooCommerce) featuring automated webhook reconciliation, expanding instant fiat QRIS and on-chain gas settlement across Indonesia and Southeast Asia.
                </p>
              </div>

              {/* Capital Allocation */}
              <div style={{ background: '#070c18', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', marginTop: '6px' }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Capital Allocation Framework (Use of Funds)
                </h5>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                  gap: '10px', 
                  fontSize: '0.82rem' 
                }}>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', border: '1px solid #1f2937' }}>
                    <strong style={{ color: '#38bdf8' }}>35% Security & Smart Audits:</strong> Anchor program verification & multi-vault stress testing.
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', border: '1px solid #1f2937' }}>
                    <strong style={{ color: '#38bdf8' }}>30% Protocol Liquidity (POL):</strong> Primary DEX pool seeding ($ZQI/USDC & SOL) for low slippage.
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', border: '1px solid #1f2937' }}>
                    <strong style={{ color: '#38bdf8' }}>20% PayFi Relayer Cluster:</strong> Enterprise RPC infrastructure & automated gas balance relayers.
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', border: '1px solid #1f2937' }}>
                    <strong style={{ color: '#38bdf8' }}>15% Merchant Onboarding:</strong> SEA creator partnerships & regional compliance execution.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ECONOMIC FLYWHEEL */}
          {activeTab === 'flywheel' && (
            <div style={{ background: '#070c18', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#10b981', fontSize: '1.05rem' }}>
                The Sustainable PayFi + DeFi Ecosystem Flywheel
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 14px 0' }}>
                How real-world retail commerce fuels organic on-chain liquidity and yield without token inflation:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.83rem' }}>
                <div style={{ padding: '12px 14px', background: '#111827', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                  <strong>Step 1 (Zero-Friction Fiat Checkout):</strong> Shoppers pay via Direct QRIS without requiring Web3 wallets. Merchants receive 100% instant fiat settlement, while the 5% protocol fee is settled autonomously via their on-chain Gas Tank (resulting in a 95% net settlement structure).
                </div>
                <div style={{ padding: '12px 14px', background: '#111827', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                  <strong>Step 2 (Automated Prepaid Gas Debit):</strong> The protocol debits a 5% fee from the merchant's SOL Gas Tank, enforced by an on-chain guardrail that halts checkouts if reserves hit zero.
                </div>
                <div style={{ padding: '12px 14px', background: '#111827', borderRadius: '8px', borderLeft: '3px solid #c084fc' }}>
                  <strong>Step 3 (Multi-Vault Solana Relay):</strong> Every checkout atomically routes SOL across 4 protocol wallets: Yield Vault (40%), Staking Pool (30%), Affiliates (15%), and Protocol Ops (15%).
                </div>
                <div style={{ padding: '12px 14px', background: '#111827', borderRadius: '8px', borderLeft: '3px solid #60a5fa' }}>
                  <strong>Step 4 (Closed-Loop DEX Refill & Yield):</strong> Merchants replenish gas reserves via the integrated AMM Swap, generating organic DEX trading volume and funding $ZQI real yield lockers.
                </div>
                <div style={{ padding: '12px 14px', background: '#111827', borderRadius: '8px', borderLeft: '3px solid #4ade80' }}>
                  <strong>Step 5 (Self-Sustaining Expansion):</strong> Real protocol cashflow continually rewards token lockers and affiliate partners, scaling merchant adoption without inflationary emissions.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#080d1a',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            &copy; 2026 ZoniqFi Protocol &bull; Confidential Institutional Brief
          </span>
          <a
            href="https://t.me/zoniqfi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .26z"/>
            </svg>
            Contact Core Lead
          </a>
        </div>
      </div>
    </div>
  );
};

export default InvestorPitchModal;