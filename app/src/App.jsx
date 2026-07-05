import { useState, useEffect } from 'react';
import logoZoniq from './assets/image_436281.png'; 
import ComplianceModal from './components/ComplianceModal'; 
import './App.css';

const currentDomain = typeof window !== 'undefined' ? window.location.hostname.replace('www.', '') : 'zoniqfi.com';

function App() {
  // ==========================================================================
  // STATE INTERFACES NAVIGATION & RESPONSIVITAS MOBILE
  // ==========================================================================
  const [activeTab, setActiveTab] = useState('defi'); // Tab aktif: 'defi', 'provizto', 'gateway'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State menu geser garis tiga di HP
  const [activeFaq, setActiveFaq] = useState(null);

  // Fake Live Metrics State (Sosial Proof Penjualan SaaS Lu)
  const [activeClients] = useState(48);
  const [whiteLabelsLive] = useState(19);
  const [oneOffBuyers] = useState(320);

  // DATA 6 PAKET DEFI AWAL (DIMASUKKAN UTUH & TIDAK KURANG)
  const pricingPackages = [
    {
      name: "Entry / Viral Launch",
      desc: "Perfect for micro-cap meme coins requiring instant viral traction and rapid trading volume acceleration.",
      features: ["AMM DEX Swap (Anti-MEV)", "Secure On-Chain Affiliate", "Anti-Sybil Engine Active", "Custom Brand UI/UX Tailoring", "Supports Phantom, Solflare, & Backpack"],
      price: "$499",
      demoLink: `https://defi.${currentDomain}/?pkg=entry` 
    },
    {
      name: "Token Velocity (3-in-1)",
      desc: "Our most popular package for active community tokens looking to mitigate heavy market selling pressure.",
      features: ["AMM DEX Swap (Anti-MEV Protection)", "Yield Optimizer Vaults (0.11% Daily)", "Secure On-Chain Affiliate System", "Custom Brand UI/UX & Live Deployment", "Lifetime Core Updates & Bug Fixes"],
      price: "$1,299",
      popular: true,
      demoLink: `https://defi.${currentDomain}/?pkg=velocity` 
    },
    {
      name: "Whale Retention Suite",
      desc: "Engineered specifically to lock circulating supply and reward loyal long-term holders with stable yields.",
      features: ["ZQI Token Lock & Vesting Hub", "Real Yield Pool (USDC Distribution)", "Secure On-Chain Affiliate System", "Emergency Early Unlock (10% Burn Penalty)", "Full Deployment & Domain Routing Setup"],
      price: "$1,199",
      demoLink: `https://defi.${currentDomain}/?pkg=whale` 
    },
    {
      name: "Safe Staking Hub",
      desc: "A pure DeFi staking and asset management platform designed for serious utility projects without referral mechanisms.",
      features: ["Yield Optimizer Vaults (Auto-Compound)", "ZQI Token Lock & Vesting Hub", "Real Yield Pool (USDC Distribution)", "Emergency Early Unlock (10% Burn Penalty)", "Custom Smart Contract Parameter Adjustments"],
      price: "$1,099",
      demoLink: `https://defi.${currentDomain}/?pkg=staking` 
    },
    {
      name: "Ultimate DeFi Suite (4-in-1)",
      desc: "The complete financial ecosystem package designed for ultimate market dominance on the Solana network.",
      features: ["AMM DEX Swap (Anti-MEV Protection)", "Yield Optimizer Vaults (Auto-Compound)", "ZQI Token Lock Hub (Vesting System)", "Secure On-Chain Affiliate (Tiered Volume)", "Priority 24/7 Core Developer Support"],
      price: "$2,499",
      demoLink: `https://defi.${currentDomain}`
    },
    {
      name: "Ecosystem Hub / Custom Edition",
      desc: "Advanced custom on-chain infrastructure tailored to complex institutional protocol requirements.",
      features: ["Full 4-in-1 Complete Modular Feature Set", "Custom Tokenomics & Fee Allocation Routing", "Multi-Asset Smart Contract Settlement", "Advanced Proprietary Anti-Bot Mechanics", "Private On-Chain Infrastructure Consultation"],
      price: "Contact Us",
      demoLink: `https://defi.${currentDomain}`
    }
  ];

  const faqData = [
    { q: "What is ZoniqFi?", a: "ZoniqFi is a premium Web3 infrastructure provider offering turnkey, plug-and-play white-label DeFi dApps on the Solana blockchain. We empower project owners and developers to launch comprehensive utility suites instantly without writing code from scratch." },
    { q: "How does the White-Label licensing model work?", a: "Once you purchase a package, our team handles all frontend customization (logos, token tickers, brand colors, smart contract links) and deploys the fully functional dApp directly to your project's custom domain or subdomain." },
    { q: "Do I need to deploy expensive native smart contracts?", a: "Not necessarily. Our infrastructure is designed with a multi-tenant architecture. You can opt to plug directly into our pre-deployed, highly optimized Devnet programs to bypass costly Solana rent-exempt storage fees while keeping your frontend completely branded." },
    { q: "Is this infrastructure protected against automated exploits?", a: "Absolutely. The Swap module is equipped with MEV Secure protocols via Jito Engine to shield retail traders from malicious sandwich attacks. Additionally, the Affiliate ledger features strict Anti-Sybil cooldown rules to prevent multi-wallet referral manipulation." }
  ];

  return (
    <div id="vzt-enterprise-shell">
      {/* ==================================================================== */}
      {/* MASTER SIDEBAR & FLEX GRID LAYOUT ENGINE TUNING */}
      {/* ==================================================================== */}
      <style>{`
        #vzt-enterprise-shell { display: flex; background-color: #0b0f19; color: #f3f4f6; min-height: 100vh; font-family: 'Inter', sans-serif; }
        #vzt-enterprise-shell * { box-sizing: border-box; }
        
        /* SIDEBAR DESKTOP SYSTEM */
        .vzt-sidebar { width: 290px; background: #0f172a; border-right: 1px solid #1e2937; display: flex; flex-direction: column; padding: 26px; position: fixed; height: 100vh; z-index: 9999; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .vzt-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 35px; }
        .vzt-brand h2 { font-size: 1.25rem; font-weight: 800; letter-spacing: 1px; color: #fff; margin:0; }
        
        .vzt-menu-list { display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0; margin: 0; }
        .vzt-menu-item { padding: 14px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem; color: #94a3b8; display: flex; align-items: center; gap: 12px; transition: all 0.2s; }
        .vzt-menu-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
        .vzt-menu-item.active { background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #fff; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25); }
        
        /* WORKSPACE DISPLAY CONTENT PANEL */
        .vzt-main-content { flex: 1; margin-left: 290px; padding: 40px 5%; min-width: 0; display: flex; flex-direction: column; }
        
        /* HAMBURGER TOGGLE TRIGGER FOR HP */
        .vzt-hamburger-btn { display: none; position: fixed; top: 16px; left: 16px; background: #1e2937; border: 1px solid #374151; color: #fff; padding: 10px 14px; border-radius: 8px; cursor: pointer; z-index: 10000; font-size: 1.2rem; }
        
        /* 6 DEFI BUNDLE PACKAGES CARDS LAYOUT */
        .vzt-pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 24px; margin-top: 30px; }
        .vzt-pricing-card { background: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 30px 24px; display: flex; flex-direction: column; justify-content: space-between; position: relative; transition: all 0.2s; }
        .vzt-pricing-card:hover { border-color: #14b8a6; transform: translateY(-3px); }
        .vzt-pricing-card.popular-card { border: 2px solid #8b5cf6; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.08); }
        .vzt-popular-badge { position: absolute; top: -13px; left: 24px; background: #8b5cf6; color: #fff; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
        
        .vzt-package-price { font-size: 2rem; font-weight: 800; color: #14b8a6; margin: 15px 0; }
        .vzt-feat-list { list-style: none; padding: 0; margin: 0 0 24px 0; }
        .vzt-feat-list li { font-size: 0.88rem; color: #d1d5db; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
        .vzt-feat-list i { color: #14b8a6; font-size: 0.85rem; }
        
        .vzt-btn-action { text-align: center; padding: 11px; border-radius: 8px; font-weight: 600; text-decoration: none; display: block; font-size: 0.9rem; transition: all 0.2s; }
        .vzt-btn-outline { border: 1px solid #1f2937; color: #94a3b8; margin-bottom: 8px; }
        .vzt-btn-outline:hover { border-color: #14b8a6; color: #14b8a6; background: rgba(20, 184, 166, 0.02); }
        .vzt-btn-solid { background: #1f2937; color: #fff; border: 1px solid #374151; }
        .vzt-pricing-card.popular-card .vzt-btn-solid { background: linear-gradient(135deg, #8b5cf6, #3b82f6); border: none; }
        .vzt-btn-solid:hover { opacity: 0.9; }

        /* PORTAL REDIRECT SPLASH SCREEN SHOWCASE */
        .vzt-showcase-hero { background: radial-gradient(circle at center, #111827 0%, #060911 100%); padding: 60px 40px; border-radius: 20px; border: 1px solid #1f2937; text-align: center; margin-top: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .vzt-showcase-title { font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0 0 16px 0; background: linear-gradient(90deg, #fff 50%, #14b8a6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .vzt-showcase-desc { color: #94a3b8; font-size: 1.05rem; line-height: 1.6; max-width: 680px; margin: 0 auto 30px auto; }
        .vzt-showcase-launch-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; font-weight: 700; border-radius: 10px; text-decoration: none; font-size: 1rem; transition: all 0.2s; border: none; cursor: pointer; }
        .vzt-btn-cyan { background: #14b8a6; color: #fff; box-shadow: 0 4px 14px rgba(20, 184, 166, 0.3); }
        .vzt-btn-cyan:hover { background: #0d9488; transform: translateY(-1px); }
        .vzt-btn-blue { background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%); color: #fff; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3); }
        .vzt-btn-blue:hover { opacity: 0.95; transform: translateY(-1px); }

        /* RESPONSIVE LAYOUT RESPONSIVITAS MOBILE */
        @media (max-width: 1024px) {
          .vzt-hamburger-btn { display: block; }
          .vzt-sidebar { transform: translateX(-100%); }
          .vzt-sidebar.mobile-open { transform: translateX(0); }
          .vzt-main-content { margin-left: 0; padding-top: 75px; }
        }
      `}</style>

      {/* COMPLIANCE CHECK LOOPS */}
      <ComplianceModal />

      {/* 📱 TOMBOL NAVIGASI GARIS TIGA (HANYA MUNCUL DI HP) */}
      <button className="vzt-hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* 🧭 NAV SIDEBAR PANEL KIRI EXPANDABLE */}
      <aside className={`vzt-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="vzt-brand">
          <img src={logoZoniq} alt="ZoniqFi Core Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <h2>ZONIQFI HUB</h2>
        </div>

        <ul className="vzt-menu-list">
          <li className={`vzt-menu-item ${activeTab === 'defi' ? 'active' : ''}`} onClick={() => { setActiveTab('defi'); setIsSidebarOpen(false); }}>
            <i className="fas fa-cubes"></i> Solana DeFi Suite
          </li>
          <li className={`vzt-menu-item ${activeTab === 'provizto' ? 'active' : ''}`} onClick={() => { setActiveTab('provizto'); setIsSidebarOpen(false); }}>
            <i className="fas fa-gem"></i> Provizto Platform
          </li>
          <li className={`vzt-menu-item ${activeTab === 'gateway' ? 'active' : ''}`} onClick={() => { setActiveTab('gateway'); setIsSidebarOpen(false); }}>
            <i className="fas fa-wallet"></i> B2B Gateway Portal
          </li>
        </ul>

        {/* BOTTOM FOOTER REVENUE CREDENTIAL DISPLAY */}
        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid #1e2937', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Network Core Integration</span>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#14b8a6', fontWeight: '600' }}>v5.0 Stable Protocol</p>
        </div>
      </aside>

      {/* 💻 CONTROLLER DISPLAY WORKSPACE BELAH KANAN */}
      <main className="vzt-main-content">

        {/* ==================================================================== */}
        {/* HARAPAN LU: TAB 1 UTAH UTUH - KATALOG 6 PAKET DEFI TIDAK ADA YANG KURANG */}
        {/* ==================================================================== */}
        {activeTab === 'defi' && (
          <div style={{ width: '100%' }}>
            {/* HERO TITLE HEADER */}
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800 }}>Solana Modular Utility Suites</h1>
              <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '1.05rem' }}>
                Pre-compiled white-label dApp solutions tailored to accelerate on-chain liquidity, token velocity, and institutional growth parameter settings.
              </p>
            </div>

            {/* LIVE METRICS SOCIAL PROOF BANNER */}
            <div style={{ display: 'flex', gap: '20px', background: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937', flexWrap: 'wrap', marginBottom: '35px', textAlign: 'center' }}>
              <div style={{ flex: 1, minWidth: '130px' }}><div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#14b8a6' }}>{oneOffBuyers + activeClients + whiteLabelsLive}+</div><div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Issued Licenses</div></div>
              <div style={{ flex: 1, minWidth: '130px' }}><div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{activeClients}+</div><div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Active Corporate Clients</div></div>
              <div style={{ flex: 1, minWidth: '130px' }}><div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{whiteLabelsLive}</div><div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Live White-Labels</div></div>
            </div>

            {/* 6 PACKAGES INTERACTIVE GRID SCROLLS */}
            <div className="vzt-pricing-grid">
              {pricingPackages.map((pkg, idx) => (
                <div key={idx} className={`vzt-pricing-card ${pkg.popular ? 'popular-card' : ''}`}>
                  {pkg.popular && <div className="vzt-popular-badge">BEST VALUE SELLER</div>}
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#fff' }}>{pkg.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.5', minHeight: '44px' }}>{pkg.desc}</p>
                    <div className="vzt-package-price">{pkg.price}</div>
                    
                    <ul className="vzt-feat-list">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx}><i className="fas fa-circle-check"></i> {feat}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <a href={pkg.demoLink} target="_blank" rel="noopener noreferrer" className="vzt-btn-action vzt-btn-outline">
                      <i className="fas fa-bolt" style={{ marginRight: '6px' }}></i> Launch Live Demo
                    </a>
                    <a href="https://t.me/zoniqfi" target="_blank" rel="noopener noreferrer" className="vzt-btn-action vzt-btn-solid">
                      {pkg.price === "Contact Us" ? "Consult Developer" : "Acquire License"}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* SUB-ACCORDION FAQ SYSTEM FOR PROPOSAL REVIEWS */}
            <div style={{ marginTop: '50px', maxWidth: '850px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '20px' }}>Frequently Asked Deployment Questions</h3>
              {faqData.map((faq, index) => (
                <div key={index} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', marginBottom: '12px', overflow: 'hidden' }}>
                  <div onClick={() => setActiveFaq(activeFaq === index ? null : index)} style={{ padding: '18px 20px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                    {faq.q} <i className="fas fa-chevron-down" style={{ transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#64748b' }}></i>
                  </div>
                  <div style={{ padding: activeFaq === index ? '0 20px 20px 20px' : '0 20px', maxHeight: activeFaq === index ? '200px' : '0px', overflow: 'hidden', transition: 'all 0.3s ease', color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: PROVIZTO PLATFORM GATEWAY ACCUMULATION LINK LINKAGE */}
        {/* ==================================================================== */}
        {activeTab === 'provizto' && (
          <div className="vzt-showcase-hero">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💎</div>
            <h1 className="vzt-showcase-title">Provizto ($VIZTO) Ecosystem Hub</h1>
            <p className="vzt-showcase-desc">
              The official institutional entry point to unlock high-yield automated DeFi pooling configurations on Solana. Accumulating $VIZTO grants operators direct clearance to MEV-shielded pipelines.
            </p>
            <a href="https://provizto.com" target="_blank" rel="noopener noreferrer" className="vzt-showcase-launch-btn vzt-btn-cyan">
              Launch Provizto Portal <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: B2B GATEWAY PORTAL CLEARED ASSETS ROUTING LINK */}
        {/* ==================================================================== */}
        {activeTab === 'gateway' && (
          <div className="vzt-showcase-hero">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</div>
            <h1 className="vzt-showcase-title">Enterprise B2B Settlement Gateway</h1>
            <p className="vzt-showcase-desc">
              A premium hybrid core routing framework bridging traditional localized transactional clearing houses directly into global decentralized ledgers via production-grade developer API configurations.
            </p>
            <a href="https://gateway.zoniqfi.com/landing.html" target="_blank" rel="noopener noreferrer" className="vzt-showcase-launch-btn vzt-btn-blue">
              Launch Gateway Console <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;