import React, { useState } from 'react';

const InvestorPitchModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('modules');

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
          maxWidth: '860px',
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
              Institutional Presentation & Grant Allocation Proposal
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
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

        {/* UNIFIED SEGMENTED TAB TRACK (PRESISI SAMA RATA & TIDAK MELOMPAT) */}
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
            <button 
              type="button"
              onClick={() => setActiveTab('modules')} 
              style={{
                flex: 1,
                height: '38px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'modules' ? '700' : '600',
                color: activeTab === 'modules' ? '#ffffff' : '#94a3b8',
                background: activeTab === 'modules' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                border: 'none',
                boxShadow: activeTab === 'modules' ? '0 2px 10px rgba(59, 130, 246, 0.4)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Core DeFi Modules
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('roadmap')} 
              style={{
                flex: 1,
                height: '38px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'roadmap' ? '700' : '600',
                color: activeTab === 'roadmap' ? '#ffffff' : '#94a3b8',
                background: activeTab === 'roadmap' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                border: 'none',
                boxShadow: activeTab === 'roadmap' ? '0 2px 10px rgba(59, 130, 246, 0.4)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Roadmap & Funding Milestones
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('flywheel')} 
              style={{
                flex: 1,
                height: '38px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: activeTab === 'flywheel' ? '700' : '600',
                color: activeTab === 'flywheel' ? '#ffffff' : '#94a3b8',
                background: activeTab === 'flywheel' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                border: 'none',
                boxShadow: activeTab === 'flywheel' ? '0 2px 10px rgba(59, 130, 246, 0.4)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Economic Flywheel
            </button>
          </div>
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, fontSize: '0.9rem', lineHeight: '1.6' }}>
          
          {/* TAB 1: CORE DEFI MODULES */}
          {activeTab === 'modules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '1rem', fontWeight: '700' }}>
                    01. AMM DEX Swap Engine (Anti-MEV Atomic Swaps)
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>TX V1 ATOMIC</span>
                </div>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  High-velocity decentralized exchange architecture utilizing Solana Transaction v1 (4,096-byte atomic payload) integrated with Jito Block Engine private bundles.
                </p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                  <li><strong>MEV Mitigation:</strong> Private transaction bundle routing completely eliminates front-running and sandwich attacks.</li>
                  <li><strong>Anti-Wash Trading:</strong> On-chain rate limit filters prevent wash volume manipulation.</li>
                  <li><strong>0.3% Flat Protocol Fee Distribution:</strong> 40% to Yield Vault, 30% to $ZQI Real Yield Pool, 15% to Affiliate Treasury, and 15% to Project Operations.</li>
                </ul>
              </div>

              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <h4 style={{ margin: 0, color: '#c084fc', fontSize: '1rem', fontWeight: '700' }}>
                    02. $ZQI Lock & Real Yield (Deflationary Supply Defense)
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>0% INFLATION</span>
                </div>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  Native token supply lock mechanism mitigating secondary market selling pressure by distributing Real Yield in stable USDC dividends.
                </p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                  <li><strong>Lock Multipliers:</strong> 30 Days (1.0x), 90 Days (1.5x), and 180 Days (2.5x weight).</li>
                  <li><strong>Deflationary Burn Defense:</strong> Emergency early unlocks trigger a mandatory 10% penalty permanently burned on-chain.</li>
                </ul>
              </div>

              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <h4 style={{ margin: 0, color: '#60a5fa', fontSize: '1rem', fontWeight: '700' }}>
                    03. Yield Optimizer Vault (Automated Compounding)
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>NON-CUSTODIAL</span>
                </div>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  Automated compounding yield generation protocol tailored for USDC single-deposit liquidity.
                </p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                  <li><strong>Predictable Returns:</strong> Programmatic baseline daily rate of 0.11% with boosted optimizations reaching up to 49.1% APY.</li>
                  <li><strong>Autonomous Execution:</strong> Auto-compounds yield periodically via non-custodial smart contracts without manual gas expenditure by depositors.</li>
                </ul>
              </div>

              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <h4 style={{ margin: 0, color: '#4ade80', fontSize: '1rem', fontWeight: '700' }}>
                    04. Secure On-Chain Affiliate (SNS-Integrated Referral)
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>ANTI-SYBIL</span>
                </div>
                <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                  Decentralized growth infrastructure distributing transparent, automated commission rebates to merchants and referrers.
                </p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                  <li><strong>Solana Name Service:</strong> Supports direct domain resolution for human-readable identities (.sns / .sol).</li>
                  <li><strong>Tiered Rebates:</strong> Bronze (10% on $0–$10k volume), Silver (18% on $10k–$100k), and Gold (25% on &gt;$100k).</li>
                  <li><strong>Anti-Sybil Cooldown:</strong> 1 transaction per 10-second threshold prevents manipulation.</li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: ROADMAP & FUNDING */}
          {activeTab === 'roadmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ borderLeft: '3px solid #14b8a6', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: '700' }}>PHASE 1 • Q3 2026 (CURRENT)</span>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
                    Bootstrapped (MVP Live)
                  </span>
                </div>
                <h4 style={{ margin: '4px 0 6px 0', color: '#fff', fontSize: '0.95rem' }}>Devnet Sandbox & Multi-Wallet Architecture</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                  Completion of all 4 modular contracts on Solana Devnet, Solana Wallet Standard integration (Phantom, Solflare, OKX, Backpack, Coinbase, Ledger), and SNS domain resolver.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '700' }}>PHASE 2 • Q4 2026</span>
                  <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Target: $40,000 - $60,000</span>
                </div>
                <h4 style={{ margin: '4px 0 6px 0', color: '#fff', fontSize: '0.95rem' }}>Formal Audits & Anchor PDA Migration</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                  Comprehensive third-party smart contract audit (OtterSec / Kudelski / Sec3), migration from demo state to on-chain Anchor Program Derived Addresses (PDA), and Dedicated RPC nodes.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: '700' }}>PHASE 3 • Q1 2027</span>
                  <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Target: $100,000 - $150,000</span>
                </div>
                <h4 style={{ margin: '4px 0 6px 0', color: '#fff', fontSize: '0.95rem' }}>Mainnet-Beta Deployment & Liquidity Seeding</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                  Solana Mainnet launch, protocol-owned liquidity injection ($ZQI/SOL & $ZQI/USDC), and activation of live 0.3% fee-to-USDC yield distribution engine.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #ec4899', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: '700' }}>PHASE 4 • Q2-Q3 2027</span>
                  <span style={{ fontSize: '0.72rem', background: '#1e293b', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Target: $50,000 - $80,000</span>
                </div>
                <h4 style={{ margin: '4px 0 6px 0', color: '#fff', fontSize: '0.95rem' }}>B2B White-Label & Regional Expansion</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                  Deployment of turnkey B2B white-label gateway, developer SDK releases, and institutional merchant onboarding in Singapore and Southeast Asia.
                </p>
              </div>

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
                    <strong style={{ color: '#38bdf8' }}>35% Smart Contract Audits:</strong> Formal code verification & penetration testing.
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', border: '1px solid #1f2937' }}>
                    <strong style={{ color: '#38bdf8' }}>30% Protocol Liquidity (POL):</strong> Primary DEX pool seeding for minimal slippage.
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', border: '1px solid #1f2937' }}>
                    <strong style={{ color: '#38bdf8' }}>20% Core Engineering:</strong> Dedicated RPC cluster, Jito relayer fees & Rust logic.
                  </div>
                  <div style={{ background: '#111827', padding: '10px', borderRadius: '6px', border: '1px solid #1f2937' }}>
                    <strong style={{ color: '#38bdf8' }}>15% Institutional BizDev:</strong> Singapore / SEA merchant onboarding & legal compliance.
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ECONOMIC FLYWHEEL */}
          {activeTab === 'flywheel' && (
            <div style={{ background: '#070c18', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#10b981', fontSize: '1.05rem' }}>
                Self-Sustaining Protocol Flywheel
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 14px 0' }}>
                ZoniqFi connects swap velocity, liquidity accumulation, and supply deflation into a continuous non-inflationary feedback loop:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.83rem' }}>
                <div style={{ padding: '12px 14px', background: '#111827', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                  <strong>Step 1 (Swap Velocity & Fee Capitalization):</strong> Users swap SOL/USDC for $ZQI. Every trade incurs a 0.3% protocol fee converted directly into non-inflationary real yield.
                </div>
                <div style={{ padding: '12px 14px', background: '#111827', borderRadius: '8px', borderLeft: '3px solid #c084fc' }}>
                  <strong>Step 2 (Supply Constraint & Lock Deflation):</strong> Traders lock $ZQI to capture 30% of swap fees in USDC dividends. Emergency unlocks trigger an automated 10% token burn.
                </div>
                <div style={{ padding: '12px 14px', background: '#111827', borderRadius: '8px', borderLeft: '3px solid #60a5fa' }}>
                  <strong>Step 3 (Vault Compounding & TVL Expansion):</strong> 40% of swap fees feed the USDC Yield Vault, autonomously compounding returns and deepening protocol-owned liquidity.
                </div>
                <div style={{ padding: '12px 14px', background: '#111827', borderRadius: '8px', borderLeft: '3px solid #4ade80' }}>
                  <strong>Step 4 (Affiliate Distribution & Viral Flow):</strong> 15% of swap fees fund the tiered referral engine, driving creators and traders back into Step 1.
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
            © 2026 ZoniqFi Protocol • Confidential Institutional Brief
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