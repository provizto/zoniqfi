import React, { useEffect } from 'react';
import logoZoniqLarge from './assets/image_436281.png';

// Dynamic domain parsing at the browser level
const currentDomain = typeof window !== 'undefined' ? window.location.hostname.replace('www.', '') : 'zoniqfi.com';

const Landing = ({ onLaunchApp }) => {
  // Automatically inject FontAwesome and Google Fonts directly into the DOM Head
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght=300;400;600;700;800&display=swap';
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
        #vzt-landing-page .hero { padding: 160px 8% 60px 8% !important; text-align: center !important; background: radial-gradient(circle at top, rgba(59, 130, 246, 0.15) 0%, transparent 60%) !important; }
        #vzt-landing-page .hero-logo-container { margin-bottom: 20px !important; display: flex !important; justify-content: center !important; align-items: center !important; }
        #vzt-landing-page .hero h1 { font-size: 3.2rem !important; font-weight: 800 !important; line-height: 1.3 !important; margin-bottom: 24px !important; background: linear-gradient(90deg, #fff 40%, #14b8a6) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }
        #vzt-landing-page .hero p { font-size: 1.2rem !important; color: #94a3b8 !important; max-width: 800px !important; margin: 0 auto !important; line-height: 1.6 !important; }

        #vzt-landing-page .portfolio-section { padding: 80px 8% !important; border-top: 1px solid #1f2937 !important; background: #090d16 !important; }
        #vzt-landing-page .portfolio-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 35px !important; margin-top: 40px !important; }
        #vzt-landing-page .portfolio-card { background: #111827 !important; border: 1px solid #1f2937 !important; border-radius: 20px !important; padding: 40px 30px !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; transition: all 0.3s ease !important; }
        #vzt-landing-page .portfolio-card:hover { border-color: #14b8a6 !important; transform: translateY(-2px) !important; box-shadow: 0 10px 30px rgba(20, 184, 166, 0.05) !important; }
        #vzt-landing-page .portfolio-card.new-release-card:hover { border-color: #3b82f6 !important; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.05) !important; }
        #vzt-landing-page .portfolio-meta { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 20px !important; }
        #vzt-landing-page .portfolio-badge { font-size: 0.75rem !important; font-weight: 600 !important; padding: 4px 10px !important; border-radius: 6px !important; background: #1f2937 !important; border: 1px solid #374151 !important; color: #94a3b8 !important; }
        #vzt-landing-page .portfolio-badge.badge-new { background: rgba(59, 130, 246, 0.1) !important; border-color: rgba(59, 130, 246, 0.3) !important; color: #60a5fa !important; font-weight: 700 !important; }
        #vzt-landing-page .portfolio-icon { font-size: 1.5rem !important; }
        #vzt-landing-page .portfolio-title { font-size: 1.5rem !important; font-weight: 700 !important; color: #fff !important; margin: 0 0 12px 0 !important; }
        #vzt-landing-page .portfolio-desc { font-size: 0.95rem !important; color: #94a3b8 !important; line-height: 1.6 !important; margin-bottom: 25px !important; min-height: 70px !important; }
        #vzt-landing-page .portfolio-list { list-style: none !important; padding: 0 !important; margin: 0 0 35px 0 !important; }
        #vzt-landing-page .portfolio-list li { font-size: 0.9rem !important; color: #e5e7eb !important; margin-bottom: 12px !important; display: flex !important; align-items: center !important; gap: 10px !important; }
        #vzt-landing-page .portfolio-list i { color: #14b8a6 !important; font-size: 0.85rem !important; }
        #vzt-landing-page .portfolio-list .blue-check { color: #3b82f6 !important; }
        #vzt-landing-page .btn-portfolio-action { display: block !important; width: 100% !important; padding: 14px !important; text-align: center !important; font-weight: 700 !important; text-decoration: none !important; border-radius: 10px !important; transition: all 0.2s ease !important; cursor: pointer !important; font-size: 0.95rem !important; border: none !important; }
        #vzt-landing-page .btn-cyan-fill { background: #14b8a6 !important; color: #fff !important; }
        #vzt-landing-page .btn-cyan-fill:hover { background: #0d9488 !important; }
        #vzt-landing-page .btn-blue-grad { background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%) !important; color: #fff !important; }
        #vzt-landing-page .btn-blue-grad:hover { opacity: 0.95 !important; transform: translateY(-0.5px) !important; }

        .vzt-promo-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; padding: 6px 16px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; }
        .vzt-promo-pulse { height: 8px; width: 8px; border-radius: 50%; background-color: #60a5fa; animation: vztPulse 2s infinite; }
        @keyframes vztPulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(96, 165, 251, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(96, 165, 251, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(96, 165, 251, 0); } }
        
        .section-title { font-size: 2rem !important; font-weight: 800 !important; color: #ffffff !important; margin-bottom: 10px !important; text-align: center !important; }
        .section-desc { font-size: 1rem !important; color: #94a3b8 !important; max-width: 600px !important; margin: 0 auto 40px auto !important; text-align: center !important; }

        #vzt-landing-page footer { border-top: 1px solid #1f2937 !important; padding: 40px 8% !important; display: flex !important; justify-content: space-between !important; align-items: center !important; background: #060911 !important; }
        #vzt-landing-page .footer-social-row { display: flex !important; gap: 16px !important; align-items: center !important; }
        #vzt-landing-page .social-icon-btn { color: #64748b !important; font-size: 1.3rem !important; text-decoration: none !important; transition: color 0.2s ease, transform 0.2s ease !important; }
        #vzt-landing-page .social-icon-btn:hover { color: #38bdf8 !important; transform: scale(1.1) !important; }

        @media (max-width: 768px) {
          #vzt-landing-page header { padding: 15px 5% !important; }
          #vzt-landing-page nav { display: none !important; }
          #vzt-landing-page .hero { padding-top: 140px !important; }
          #vzt-landing-page .hero h1 { font-size: 2.2rem !important; line-height: 1.3 !important; }
          #vzt-landing-page .portfolio-grid { grid-template-columns: 1fr !important; gap: 25px !important; }
          #vzt-landing-page footer { flex-direction: column !important; gap: 20px !important; text-align: center !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <header>
        <div className="brand-wrapper">
          <img src={logoZoniqLarge} alt="ZoniqFi Nav Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <div className="logo">ZONIQFI</div>
        </div>
        <nav>
          <a href="#products">Products</a>
          {/* Mengarahkan tab 'Packages' langsung ke subdomain baru */}
          <a href={`https://defi.${currentDomain}`}>DeFi Packages</a>
          <a href="https://t.me/zoniqfi" target="_blank" rel="noopener noreferrer">Contact</a>
        </nav>
        <a href={`https://defi.${currentDomain}`} className="btn-launch">
          Explore Ecosystem
        </a>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-logo-container">
          <img src={logoZoniqLarge} alt="ZoniqFi Hero Logo" style={{ width: '110px', height: '110px', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.35))' }} />
        </div>
        
        <div className="vzt-promo-badge">
          <span className="vzt-promo-pulse"></span>
          ZoniqFi Corporate Ecosystem Hub
        </div>
        
        <h1>PREMIUM WHITE-LABEL WEB3 SOFTWARE OPERATIONS</h1>
        <p>Accelerate your decentralized project launch with proven core components. ZoniqFi delivers autonomous, high-performance infrastructure configurations designed for advanced transaction processing and native cross-chain settlement integrity.</p>
      </section>

      {/* PORTFOLIO HUB */}
      <section id="products" className="portfolio-section">
        <h2 className="section-title">Institutional Web3 Suite Portfolio</h2>
        <p className="section-desc">Select or combine our complete architectural stacks to maximize trading transaction velocities and protect institutional asset pools.</p>
        
        <div className="portfolio-grid">
          
          {/* PRODUCT 1 */}
          <div className="portfolio-card">
            <div>
              <div className="portfolio-meta">
                <span className="portfolio-badge">Token Utility</span>
                <span className="portfolio-icon">💎</span>
              </div>
              <h3 className="portfolio-title">Provizto ($VIZTO) Utility Ecosystem</h3>
              <p className="portfolio-desc">The official entry point to unlock high-yield automated DeFi mechanics on Solana. Accumulating $VIZTO grants you direct access to MEV-shielded asset routing, premium USDC yield compounding, and decentralized affiliate incentives.</p>
              <ul className="portfolio-list">
                <li><i className="fas fa-circle-check"></i> Integrated Suite: AMM DEX Swap & Yield Optimizer Vault</li>
                <li><i className="fas fa-circle-check"></i> Complete Mechanics: VIZTO Lock & Yield Engine</li>
                <li><i className="fas fa-circle-check"></i> Scalable Growth: Secure On-Chain Affiliate Architecture</li>
              </ul>
            </div>
            <a href="https://provizto.com" target="_blank" rel="noopener noreferrer" className="btn-portfolio-action btn-cyan-fill">
              Buy $VIZTO & Launch App Template <i className="fas fa-arrow-right" style={{ marginLeft: '6px' }}></i>
            </a>
          </div>

          {/* PRODUCT 2 */}
          <div className="portfolio-card new-release-card">
            <div>
              <div className="portfolio-meta">
                <span className="portfolio-badge badge-new">✨ NEW B2B RELEASE</span>
                <span className="portfolio-icon">🏪</span>
              </div>
              <h3 className="portfolio-title">Web3 Digital Core Enterprise Hybrid B2B Gateway</h3>
              <p className="portfolio-desc">A premium infrastructure gateway bridging localized legacy Web2 traditional core-banking settlement flows directly into global non-custodial decentralized ledger ecosystems. Now fully integrated with global & local payment processors.</p>
              <ul className="portfolio-list">
                  <li><i className="fas fa-circle-check blue-check"></i> Enterprise SaaS License Management</li>
                  <li><i className="fas fa-circle-check blue-check"></i> Developer API Access Token Gateways</li>
                  <li><i className="fas fa-circle-check blue-check"></i> Premium Web3 UI Toolkit & React Modules</li>
                  <li><i className="fas fa-circle-check blue-check"></i> 💳 Credit Card | 📱 QRIS | 🪙 Ethereum (ETH)</li>
              </ul>
            </div>
            <a href="https://gateway.zoniqfi.com/landing.html" target="_blank" rel="noopener noreferrer" className="btn-portfolio-action btn-blue-grad">
              Launch Gateway Portal <i className="fas fa-external-link-alt" style={{ marginLeft: '6px' }}></i>
            </a>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 ZoniqFi. All Rights Reserved. Premium Web3 Software-as-a-Service Infrastructure.</p>
        <div className="footer-social-row">
          <a href="https://t.me/zoniqfi" target="_blank" rel="noopener noreferrer" className="social-icon-btn"><i className="fab fa-telegram"></i></a>
          <a href="https://x.com/zoniqfi" target="_blank" rel="noopener noreferrer" className="social-icon-btn"><i className="fab fa-x-twitter"></i></a>
          <a href="https://discord.gg/zoniqfi" target="_blank" rel="noopener noreferrer" className="social-icon-btn"><i className="fab fa-discord"></i></a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;