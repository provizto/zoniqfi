import React, { useState, useEffect } from 'react';
import logoZoniqLarge from './assets/image_436281.png';

const Landing = ({ 
  activeClients = 48, 
  whiteLabelsLive = 19, 
  oneOffBuyers = 320, 
  onLaunchApp 
}) => {
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const faLink = document.createElement('link');
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    faLink.rel = 'stylesheet';
    document.head.appendChild(faLink);

    return () => {
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
      if (document.head.contains(faLink)) document.head.removeChild(faLink);
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const defiProducts = [
    {
      id: "dex-swap",
      title: "AMM DEX Swap Engine",
      badge: "Tx v1 & MEV SECURE",
      badgeClass: "badge-cyan",
      icon: "fa-repeat",
      desc: "High-velocity decentralized exchange engine integrated with Jito Block Engine routing and Solana Transaction v1 format to secure atomic orders against sandwich attacks.",
      features: [
        "Native Solana Transaction v1 (4,096-Byte Atomic Payload)",
        "Private Transaction Bundles via Jito Engine (Anti-Sandwich)",
        "Anti-Wash Trading Protection (On-Chain Cooldown Limits)",
        "0.3% Flat Protocol Fee with 4-way atomic fee routing"
      ],
      btnText: "Launch AMM Swap Demo",
      btnClass: "btn-cyan-fill"
    },
    {
      id: "yield-vault",
      title: "Yield Optimizer Vault",
      badge: "AUTO-COMPOUND",
      badgeClass: "badge-blue",
      icon: "fa-vault",
      desc: "Automated compounding yield generation protocol. Single-deposit USDC architecture executing periodic programmatic rebalancing and auto-compounding strategies.",
      features: [
        "Boosted APY optimizations up to 49.1%",
        "Predictable 0.11% Daily Base Yield Rate",
        "Dynamic real-time return projection calculator",
        "Non-custodial smart contract deposit logic"
      ],
      btnText: "Launch Vault Demo",
      btnClass: "btn-blue-grad"
    },
    {
      id: "token-lock",
      title: "$ZQI Lock & Real Yield",
      badge: "CIRCULATING DEFENSE",
      badgeClass: "badge-purple",
      icon: "fa-lock",
      desc: "Native token supply lock mechanism to mitigate secondary market selling pressure while distributing non-inflationary Real Yield dividends in stable USDC.",
      features: [
        "Flexible Locking Horizons (Instant Horizon & Boosted Epochs)",
        "Up to 2.5x Reward Multiplier for long-term locks",
        "Deflationary Emergency Early Unlock (10% Burn Penalty)",
        "Automated reward weight settlement logic"
      ],
      btnText: "Launch Staking Lock Demo",
      btnClass: "btn-purple-grad"
    },
    {
      id: "onchain-affiliate",
      title: "Secure On-Chain Affiliate",
      badge: "ANTI-SYBIL & SNS",
      badgeClass: "badge-emerald",
      icon: "fa-users-gear",
      desc: "Decentralized tiered referral infrastructure distributing transparent transaction fee commissions directly to user and merchant wallets.",
      features: [
        "SNS Domain Resolution (.sns & .sol standards)",
        "Anti-Sybil Cooldown Engine (1 tx / 10s anti-spam defense)",
        "3-Tier Rebate Structure: Bronze (10%), Silver (18%), Gold (25%)",
        "Instant on-chain referral verification & domain normalization"
      ],
      btnText: "Launch Affiliate Demo",
      btnClass: "btn-emerald-fill"
    }
  ];

  const faqData = [
    { 
      q: "What are the advantages of Solana Transaction v1 in ZoniqFi?", 
      a: "The Transaction v1 format expands payload capacity up to 4,096 bytes. This allows ZoniqFi to execute anti-wash verification, MEV private bundle routing, swap liquidity settlement, and 4-way fee distributions in a single atomic instruction without multi-batch risk." 
    },
    { 
      q: "How does Anti-MEV protection safeguard trades?", 
      a: "The AMM Swap routes transactions through Jito Block Engine private bundles, completely bypassing public mempools vulnerable to predatory front-running and sandwich bots." 
    },
    { 
      q: "Does the Affiliate module support Solana Name Service (SNS) domains?", 
      a: "Yes. ZoniqFi natively supports SNS migration standards, allowing users to register and verify referral connections using human-readable domain names (.sns / .sol) alongside raw Public Keys." 
    },
    { 
      q: "How does the supply defense mechanism protect tokenomics?", 
      a: "Any emergency early unlocks prior to epoch maturation trigger an automated 10% penalty that is burned on-chain permanently, creating continuous deflationary pressure on circulating supply." 
    }
  ];

  return (
    <div id="vzt-landing-page">
      <style>{`
        #vzt-landing-page { background-color: #0b0f19 !important; color: #f3f4f6 !important; min-height: 100vh !important; font-family: 'Inter', sans-serif !important; margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; text-align: left !important; }
        #vzt-landing-page * { box-sizing: border-box !important; }
        #vzt-landing-page header { display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 15px 8% !important; border-bottom: 1px solid #1f2937 !important; background: rgba(11, 15, 25, 0.8) !important; backdrop-filter: blur(12px) !important; position: fixed !important; width: 100% !important; top: 0 !important; left: 0 !important; z-index: 99999 !important; }
        #vzt-landing-page .brand-wrapper { display: flex !important; align-items: center !important; gap: 10px !important; }
        #vzt-landing-page .logo { font-size: 1.4rem !important; font-weight: 700 !important; letter-spacing: 1px !important; background: linear-gradient(45deg, #fff, #3b82f6) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; margin: 0 !important; }
        #vzt-landing-page nav a { color: #f3f4f6 !important; text-decoration: none !important; margin: 0 15px !important; font-size: 0.95rem !important; font-weight: 500 !important; transition: color 0.3s !important; }
        #vzt-landing-page nav a:hover { color: #14b8a6 !important; }
        #vzt-landing-page .btn-launch { background: linear-gradient(135deg, #8b5cf6, #3b82f6) !important; color: #fff !important; padding: 10px 22px !important; border-radius: 8px !important; text-decoration: none !important; font-weight: 600 !important; border: none !important; cursor: pointer !important; display: inline-block !important; }
        #vzt-landing-page .btn-launch:hover { opacity: 0.95 !important; }
        
        #vzt-landing-page .hero { padding: 150px 8% 40px 8% !important; text-align: center !important; background: radial-gradient(circle at top, rgba(59, 130, 246, 0.15) 0%, transparent 60%) !important; }
        #vzt-landing-page .hero-logo-container { margin-bottom: 20px !important; display: flex !important; justify-content: center !important; align-items: center !important; }
        #vzt-landing-page .hero h1 { font-size: 3rem !important; font-weight: 800 !important; line-height: 1.25 !important; margin-bottom: 20px !important; background: linear-gradient(90deg, #fff 40%, #14b8a6) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }
        #vzt-landing-page .hero p { font-size: 1.15rem !important; color: #94a3b8 !important; max-width: 800px !important; margin: 0 auto !important; line-height: 1.6 !important; }
        
        #vzt-landing-page .vzt-promo-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; padding: 6px 16px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; }
        #vzt-landing-page .vzt-promo-pulse { height: 8px; width: 8px; border-radius: 50%; background-color: #60a5fa; }

        /* METRICS SOCIAL PROOF BANNER */
        #vzt-landing-page .metrics-banner { display: flex !important; justify-content: center !important; flex-wrap: wrap !important; gap: 30px !important; padding: 30px 8% !important; background: #111827 !important; border-top: 1px solid #1f2937 !important; border-bottom: 1px solid #1f2937 !important; }
        #vzt-landing-page .metric-item { text-align: center !important; min-width: 150px !important; flex: 1 !important; }
        #vzt-landing-page .metric-value { font-size: 1.8rem !important; font-weight: 800 !important; color: #14b8a6 !important; }
        #vzt-landing-page .metric-label { font-size: 0.8rem !important; color: #94a3b8 !important; text-transform: uppercase !important; letter-spacing: 1px !important; margin-top: 6px !important; }

        /* DEFI 4 PRODUCTS GRID */
        #vzt-landing-page .defi-section { padding: 60px 8% !important; background: #090d16 !important; }
        #vzt-landing-page .defi-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 30px !important; margin-top: 40px !important; }
        #vzt-landing-page .defi-card { background: #111827 !important; border: 1px solid #1f2937 !important; border-radius: 18px !important; padding: 35px 28px !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; transition: all 0.3s ease !important; }
        #vzt-landing-page .defi-card:hover { transform: translateY(-4px) !important; border-color: #3b82f6 !important; box-shadow: 0 12px 30px rgba(0,0,0,0.3) !important; }
        
        #vzt-landing-page .card-header-meta { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 18px !important; }
        #vzt-landing-page .product-icon { font-size: 1.4rem !important; color: #38bdf8 !important; }
        #vzt-landing-page .badge-pill { font-size: 0.75rem !important; font-weight: 700 !important; padding: 4px 10px !important; border-radius: 6px !important; }
        #vzt-landing-page .badge-cyan { background: rgba(20, 184, 166, 0.15) !important; color: #14b8a6 !important; border: 1px solid rgba(20, 184, 166, 0.3) !important; }
        #vzt-landing-page .badge-blue { background: rgba(59, 130, 246, 0.15) !important; color: #60a5fa !important; border: 1px solid rgba(59, 130, 246, 0.3) !important; }
        #vzt-landing-page .badge-purple { background: rgba(168, 85, 247, 0.15) !important; color: #c084fc !important; border: 1px solid rgba(168, 85, 247, 0.3) !important; }
        #vzt-landing-page .badge-emerald { background: rgba(34, 197, 94, 0.15) !important; color: #4ade80 !important; border: 1px solid rgba(34, 197, 94, 0.3) !important; }

        #vzt-landing-page .defi-card h3 { font-size: 1.4rem !important; font-weight: 700 !important; color: #ffffff !important; margin: 0 0 12px 0 !important; }
        #vzt-landing-page .defi-card p { font-size: 0.92rem !important; color: #94a3b8 !important; line-height: 1.6 !important; margin-bottom: 20px !important; }
        #vzt-landing-page .defi-features { list-style: none !important; padding: 0 !important; margin: 0 0 25px 0 !important; }
        #vzt-landing-page .defi-features li { font-size: 0.88rem !important; color: #e2e8f0 !important; margin-bottom: 10px !important; display: flex !important; align-items: center !important; gap: 10px !important; }
        #vzt-landing-page .defi-features i { color: #10b981 !important; font-size: 0.85rem !important; flex-shrink: 0 !important; }

        #vzt-landing-page .btn-action-card { width: 100% !important; padding: 13px !important; border-radius: 8px !important; font-weight: 700 !important; font-size: 0.92rem !important; cursor: pointer !important; border: none !important; transition: all 0.2s ease !important; display: flex !important; justify-content: center !important; align-items: center !important; gap: 8px !important; }
        #vzt-landing-page .btn-cyan-fill { background: #14b8a6 !important; color: #fff !important; }
        #vzt-landing-page .btn-cyan-fill:hover { background: #0d9488 !important; }
        #vzt-landing-page .btn-blue-grad { background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%) !important; color: #fff !important; }
        #vzt-landing-page .btn-blue-grad:hover { opacity: 0.95 !important; }
        #vzt-landing-page .btn-purple-grad { background: linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%) !important; color: #fff !important; }
        #vzt-landing-page .btn-purple-grad:hover { opacity: 0.95 !important; }
        #vzt-landing-page .btn-emerald-fill { background: #10b981 !important; color: #fff !important; }
        #vzt-landing-page .btn-emerald-fill:hover { background: #059669 !important; }

        /* CTA BOX */
        .vzt-cta-wrapper { max-width: 850px; margin: 40px auto 20px auto; text-align: center; }
        .vzt-cta-card { background: linear-gradient(180deg, #111827 0%, #060911 100%); border: 1px solid #1f2937; border-radius: 20px; padding: 35px 25px; }
        .vzt-cta-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 10px; }
        .vzt-cta-desc { font-size: 0.95rem; color: #94a3b8; max-width: 600px; margin: 0 auto 25px auto; line-height: 1.6; }
        .vzt-tg-btn { display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(90deg, #7c3aed 0%, #2563eb 100%); color: #fff !important; font-weight: 700; font-size: 1rem; padding: 14px 32px; border-radius: 12px; text-decoration: none !important; transition: all 0.3s ease; }
        .vzt-tg-btn:hover { transform: translateY(-2px); opacity: 0.95; }

        /* FAQ */
        #vzt-landing-page .faq-section { padding: 60px 8% 80px 8% !important; max-width: 900px !important; margin: 0 auto !important; }
        #vzt-landing-page .faq-item { background: #111827 !important; border: 1px solid #1f2937 !important; border-radius: 8px !important; margin-bottom: 15px !important; overflow: hidden !important; }
        #vzt-landing-page .faq-question { padding: 18px 20px !important; font-weight: 600 !important; cursor: pointer !important; display: flex !important; justify-content: space-between !important; align-items: center; color: #fff !important; }
        #vzt-landing-page .faq-answer { padding: 0 20px !important; max-height: 0px; overflow: hidden !important; transition: max-height 0.3s ease, padding 0.3s ease !important; color: #94a3b8 !important; line-height: 1.6 !important; font-size: 0.92rem !important; }

        /* FOOTER */
        #vzt-landing-page footer { border-top: 1px solid #1f2937 !important; padding: 35px 8% !important; display: flex !important; justify-content: space-between !important; align-items: center !important; background: #060911 !important; }
        #vzt-landing-page .footer-social-row { display: flex !important; gap: 16px !important; }
        #vzt-landing-page .social-icon-btn { color: #64748b !important; font-size: 1.25rem !important; text-decoration: none !important; transition: color 0.2s ease; }
        #vzt-landing-page .social-icon-btn:hover { color: #38bdf8 !important; }
        
        .section-title { font-size: 2rem !important; font-weight: 800 !important; color: #ffffff !important; margin-bottom: 10px !important; text-align: center !important; }
        .section-desc { font-size: 1rem !important; color: #94a3b8 !important; max-width: 650px !important; margin: 0 auto 30px auto !important; text-align: center !important; }

        @media (max-width: 768px) {
          #vzt-landing-page header { padding: 15px 5% !important; }
          #vzt-landing-page nav { display: none !important; }
          #vzt-landing-page .hero { padding-top: 130px !important; }
          #vzt-landing-page .hero h1 { font-size: 2.1rem !important; }
          #vzt-landing-page .metrics-banner { flex-direction: column !important; gap: 20px !important; }
          #vzt-landing-page .defi-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          #vzt-landing-page footer { flex-direction: column !important; gap: 20px !important; text-align: center !important; }
          .vzt-tg-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* NAVBAR HEADER */}
      <header>
        <div className="brand-wrapper">
          <img 
            src={logoZoniqLarge} 
            alt="ZoniqFi Nav Logo" 
            style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
          />
          <div className="logo">ZONIQFI</div>
        </div>
        <nav>
          <a href="#products">DeFi Modules</a>
          <a href="#faq">FAQ</a>
          <a href="https://t.me/zoniqfi" target="_blank" rel="noopener noreferrer">Telegram</a>
        </nav>
        <button onClick={onLaunchApp} className="btn-launch">
          Live dApp Demo
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-logo-container">
          <img 
            src={logoZoniqLarge} 
            alt="ZoniqFi Hero Logo" 
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.35))'
            }} 
          />
        </div>
        
        <div className="vzt-promo-badge">
          <span className="vzt-promo-pulse"></span>
          Solana Web3 Infrastructure Suite v5.0
        </div>
        
        <h1>MODULAR SOLANA DEFI SUITE</h1>
        <p>Turnkey dApp infrastructure for the Solana ecosystem. Powered by atomic Solana Transaction v1 execution, Anti-MEV protection via Jito Engine, multi-duration staking, automated yield vaults, and SNS domain identity resolution.</p>
      </section>

      {/* METRICS BANNER */}
      <div className="metrics-banner">
        <div className="metric-item">
          <div className="metric-value">{oneOffBuyers + activeClients + whiteLabelsLive}+</div>
          <div className="metric-label">Total Licenses Issued</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{activeClients}+</div>
          <div className="metric-label">Active Enterprise Clients</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{whiteLabelsLive}</div>
          <div className="metric-label">Live Deployed White-Labels</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{oneOffBuyers}+</div>
          <div className="metric-label">One-Off License Buyers</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">&lt; 48 Hours</div>
          <div className="metric-label">Avg. Integration Speed</div>
        </div>
      </div>

      {/* 4 DEFI PRODUCTS SECTION */}
      <section id="products" className="defi-section">
        <h2 className="section-title">4 Core DeFi Infrastructure Modules</h2>
        <p className="section-desc">Explore production-ready smart contract modules and decentralized interfaces in the Solana Sandbox environment.</p>
        
        <div className="defi-grid">
          {defiProducts.map((prod) => (
            <div key={prod.id} className="defi-card">
              <div>
                <div className="card-header-meta">
                  <span className={`badge-pill ${prod.badgeClass}`}>{prod.badge}</span>
                  <i className={`fas ${prod.icon} product-icon`}></i>
                </div>
                <h3>{prod.title}</h3>
                <p>{prod.desc}</p>
                <ul className="defi-features">
                  {prod.features.map((feat, fIdx) => (
                    <li key={fIdx}>
                      <i className="fas fa-check-circle"></i>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={onLaunchApp} className={`btn-action-card ${prod.btnClass}`}>
                {prod.btnText} <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="vzt-cta-wrapper">
          <div className="vzt-cta-card">
            <h2 className="vzt-cta-title">CUSTOM DEFI ENGINE INTEGRATION</h2>
            <p className="vzt-cta-desc">Need custom SPL token support or bespoke treasury fee routing for your project? Connect directly with our core engineering team.</p>
            
            <a 
              href="https://t.me/zoniqfi" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="vzt-tg-btn"
            >
              <i className="fab fa-telegram-plane"></i>
              Connect with Developer Team on Telegram
            </a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="faq-section">
        <h2 className="section-title">Frequently Asked Questions (FAQ)</h2>
        <p className="section-desc">Concise answers regarding transaction mechanics, security protocols, and dApp execution.</p>
        
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.q} 
              <i className="fas fa-chevron-down" style={{ transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', color: '#94a3b8' }}></i>
            </div>
            <div className="faq-answer" style={{
              paddingTop: activeFaq === index ? '16px' : '0px',
              paddingBottom: activeFaq === index ? '18px' : '0px',
              maxHeight: activeFaq === index ? '200px' : '0px'
            }}>
              {faq.a}
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 ZoniqFi. All Rights Reserved. Solana DeFi & Web3 Infrastructure.</p>
        <div className="footer-social-row">
          <a href="https://t.me/zoniqfi" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Telegram">
            <i className="fab fa-telegram"></i>
          </a>
          <a href="https://x.com/zoniqfi" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="X (Twitter)">
            <i className="fab fa-x-twitter"></i>
          </a>
          <a href="https://discord.gg/zoniqfi" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Discord">
            <i className="fab fa-discord"></i>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;