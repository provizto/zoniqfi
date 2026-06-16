import React, { useState, useEffect } from 'react';

const Landing = ({ totalValueLocked, swapsCount, onLaunchApp }) => {
  const [activeFaq, setActiveFaq] = useState(null);

  // Suntik otomatis FontAwesome dan Google Fonts langsung ke DOM Head saat komponen dimuat
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const faLink = document.createElement('link');
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    faLink.rel = 'stylesheet';
    document.head.appendChild(faLink);

    return () => {
      // Membersihkan DOM Head saat berpindah komponen
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
      if (document.head.contains(faLink)) document.head.removeChild(faLink);
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const pricingPackages = [
    {
      name: "Entry / Viral Launch",
      desc: "Cocok untuk mikro-cap meme coin yang butuh viralitas kilat dan volume instan.",
      features: ["AMM DEX Swap (Anti-MEV)", "Secure On-Chain Affiliate", "Sistem Anti-Sybil Actived", "Custom Brand UI/UX", "Support Phantom/Solflare/Backpack"],
      price: "$499"
    },
    {
      name: "Token Velocity (3-in-1)",
      desc: "Paket paling populer untuk token komunitas aktif yang ingin menahan tekanan jual.",
      features: ["AMM DEX Swap (Anti-MEV)", "Yield Optimizer Vaults (0.11% Daily)", "Secure On-Chain Affiliate", "Custom Brand UI/UX & Live Deployment", "Free Updates & Bug Fixes"],
      price: "$1,299",
      popular: true
    },
    {
      name: "Whale Retention Suite",
      desc: "Berfokus mengunci pasokan token beredar dan mengapresiasi loyal holder.",
      features: ["VZT Token Lock & Vesting Hub", "Real Yield Pool (USDC Rewards)", "Secure On-Chain Affiliate", "Emergency Early Unlock (10% Penalty)", "Full Setup & Domain Configuration"],
      price: "$1,199"
    },
    {
      name: "Safe Staking Hub",
      desc: "Platform staking murni untuk proyek utilitas serius tanpa sistem referral.",
      features: ["Yield Optimizer Vaults (Auto-Compound)", "VZT Token Lock & Vesting Hub", "Real Yield Pool (USDC Rewards)", "Emergency Early Unlock (10% Penalty)", "Custom Smart Contract Parameters"],
      price: "$1,099"
    },
    {
      name: "Ultimate DeFi Suite (4-in-1)",
      desc: "Ekosistem keuangan terpadu terlengkap untuk mendominasi pasar Solana.",
      features: ["AMM DEX Swap (Anti-MEV Protection)", "Yield Optimizer Vaults (Auto-Compound)", "VZT Token Lock Hub (Vesting System)", "Secure On-Chain Affiliate (Tiered Volume)", "Priority 24/7 Developer Support"],
      price: "$2,499"
    },
    {
      name: "Ecosystem Hub / Custom Edition",
      desc: "Kustomisasi arsitektur on-chain tingkat lanjut untuk kebutuhan khusus platform publik.",
      features: ["Semua Fitur Komplit 4-in-1", "Custom Tokenomics & Fee Routing", "Multi-Asset Smart Contract Settlement", "Advanced Anti-Bot Integration", "Private Infrastructure Consultations"],
      price: "Hubungi Kami"
    }
  ];

  const faqData = [
    { q: "Apa itu Zoniq Finance?", a: "Zoniq Finance adalah penyedia infrastruktur Web3 premium yang menjual dApp DeFi modular siap pakai (White-Label) di jaringan Solana. Kami membantu project owner dan developer meluncurkan ekosistem token mereka secara instan tanpa perlu coding dari nol." },
    { q: "Bagaimana cara kerja sistem lisensi White-Label ini?", a: "Setelah Anda memilih paket, kami akan melakukan kustomisasi visual (logo, nama token, warna brand, alamat smart contract) pada dApp, lalu mendepolynya langsung ke domain milik proyek Anda sendiri." },
    { q: "Apakah saya harus men-deploy Smart Contract baru yang mahal?", a: "Tidak perlu. Infrastruktur kami dirancang secara Multi-Tenant. Anda bisa langsung menembak ke program on-chain kami yang sudah stabil di Mainnet, menghemat biaya sewa rent-exempt Solana yang mahal, dan proyek Anda bisa langsung siap pakai." },
    { q: "Apakah infrastruktur ini aman dari serangan bot?", a: "Sangat aman. Modul Swap kami dilengkapi fitur MEV Secure via Jito Engine untuk melindungi retail dari sandwich attacks, sedangkan modul Affiliate kami dilengkapi logika Anti-Sybil untuk mencegah manipulasi multi-wallet." },
    { q: "Bagaimana jika saya ingin melakukan upgrade fitur di kemudian hari?", a: "Sistem kami berbasis saklar modular (Toggle System). Jika Anda memulai dengan Paket Entry dan ingin menambahkan fitur Lock Token atau Optimizer di masa mendatang, kami tinggal mengaktifkannya via konfigurasi kode tanpa perlu merombak ulang website Anda." }
  ];

  return (
    <div id="vzt-landing-page">
      <style>{`
        #vzt-landing-page {
          background-color: #0b0f19 !important;
          color: #f3f4f6 !important;
          min-height: 100vh !important;
          font-family: 'Inter', sans-serif !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
          text-align: left !important;
        }
        #vzt-landing-page * {
          box-sizing: border-box !important;
        }
        #vzt-landing-page header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 20px 8% !important;
          border-bottom: 1px solid #1f2937 !important;
          background: rgba(11, 15, 25, 0.8) !important;
          backdrop-filter: blur(12px) !important;
          position: fixed !important;
          width: 100% !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 99999 !important;
        }
        #vzt-landing-page .logo {
          font-size: 1.4rem !important;
          font-weight: 700 !important;
          letter-spacing: 1px !important;
          background: linear-gradient(45deg, #fff, #3b82f6) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        #vzt-landing-page nav a {
          color: #f3f4f6 !important;
          text-decoration: none !important;
          margin: 0 15px !important;
          font-size: 0.95rem !important;
          font-weight: 500 !important;
          transition: color 0.3s !important;
        }
        #vzt-landing-page nav a:hover { color: #14b8a6 !important; }
        #vzt-landing-page .btn-launch {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6) !important;
          color: #fff !important;
          padding: 10px 22px !important;
          border-radius: 8px !important;
          text-decoration: none !important;
          font-weight: 600 !important;
          border: none !important;
          cursor: pointer !important;
        }
        #vzt-landing-page .hero {
          padding: 180px 8% 60px 8% !important;
          text-align: center !important;
          background: radial-gradient(circle at top, rgba(59, 130, 246, 0.15) 0%, transparent 60%) !important;
        }
        #vzt-landing-page .hero h1 {
          font-size: 3.2rem !important;
          font-weight: 800 !important;
          line-height: 1.2 !important;
          margin-bottom: 20px !important;
          background: linear-gradient(90deg, #fff 40%, #14b8a6) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
        #vzt-landing-page .hero p {
          font-size: 1.2rem !important;
          color: #94a3b8 !important;
          max-width: 800px !important;
          margin: 0 auto !important;
        }
        #vzt-landing-page .pricing-section { padding: 80px 8% !important; }
        #vzt-landing-page .pricing-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 30px !important;
          margin-top: 40px !important;
        }
        #vzt-landing-page .pricing-card {
          background: #111827 !important;
          border: 1px solid #1f2937 !important;
          border-radius: 16px !important;
          padding: 35px 25px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          position: relative !important;
          transition: border-color 0.3s, transform 0.3s !important;
        }
        #vzt-landing-page .pricing-card:hover { border-color: #3b82f6 !important; transform: translateY(-4px) !important; }
        #vzt-landing-page .pricing-card.popular-card { border: 2px solid #8b5cf6 !important; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.1) !important; }
        #vzt-landing-page .popular-badge {
          position: absolute !important; top: -14px; left: 25px;
          background: #8b5cf6 !important; color: #fff !important;
          font-size: 0.75rem !important; font-weight: 700 !important;
          padding: 4px 12px !important; border-radius: 20px !important;
        }
        #vzt-landing-page .package-name { font-size: 1.4rem !important; font-weight: 700 !important; color: #fff !important; margin: 0 0 10px 0 !important; }
        #vzt-landing-page .package-desc { font-size: 0.9rem !important; color: #94a3b8 !important; min-height: 45px !important; margin-bottom: 25px !important; }
        #vzt-landing-page .package-price { font-size: 2.2rem !important; font-weight: 800 !important; color: #14b8a6 !important; margin-bottom: 25px !important; }
        #vzt-landing-page .features-list { list-style: none !important; padding: 0 !important; margin: 0 0 35px 0 !important; }
        #vzt-landing-page .features-list li { font-size: 0.9rem !important; color: #d1d5db !important; margin-bottom: 12px !important; display: flex !important; align-items: center !important; gap: 10px !important; }
        #vzt-landing-page .features-list i { color: #14b8a6 !important; }
        #vzt-landing-page .btn-order {
          background: #1f2937 !important; color: #fff !important;
          text-align: center !important; padding: 12px !important;
          border-radius: 8px !important; font-weight: 600 !important;
          text-decoration: none !important; border: 1px solid #374151 !important;
          transition: background 0.3s !important; display: block !important;
        }
        #vzt-landing-page .pricing-card.popular-card .btn-order { background: linear-gradient(135deg, #8b5cf6, #3b82f6) !important; border: none !important; }
        #vzt-landing-page .btn-order:hover { background: #374151 !important; }
        #vzt-landing-page .pricing-card.popular-card .btn-order:hover { opacity: 0.9 !important; }
        #vzt-landing-page .faq-section { padding: 60px 8% 80px 8% !important; max-width: 900px !important; margin: 0 auto !important; }
        #vzt-landing-page .faq-item { background: #111827 !important; border: 1px solid #1f2937 !important; border-radius: 8px !important; margin-bottom: 15px !important; overflow: hidden !important; }
        #vzt-landing-page .faq-question { padding: 20px !important; font-weight: 600 !important; cursor: pointer !important; display: flex !important; justify-content: space-between !important; align-items: center; color: #fff !important; }
        #vzt-landing-page .faq-answer { padding: 0 20px !important; max-height: 0px; overflow: hidden !important; transition: max-height 0.3s ease, padding 0.3s ease !important; color: #94a3b8 !important; line-height: 1.6 !important; font-size: 0.95rem !important; }
        #vzt-landing-page footer { border-top: 1px solid #1f2937 !important; padding: 40px 8% !important; display: flex !important; justify-content: space-between !important; align-items: center !important; background: #060911 !important; }
        @media (max-width: 1024px) { #vzt-landing-page .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) {
          #vzt-landing-page header { padding: 15px 5% !important; }
          #vzt-landing-page nav { display: none !important; }
          #vzt-landing-page .hero h1 { font-size: 2.2rem !important; }
          #vzt-landing-page .pricing-grid { grid-template-columns: 1fr !important; }
          #vzt-landing-page footer { flex-direction: column !important; gap: 20px !important; text-align: center !important; }
        }
      `}</style>

      {/* NAVBAR HEADER */}
      <header>
        <div className="logo">ZONIQ FINANCE</div>
        <nav>
          <a href="#pricing">Varian Paket</a>
          <a href="#faq">FAQ</a>
          <a href="https://t.me/usernameTelegramAnda" target="_blank" rel="noopener noreferrer">Hubungi Kami</a>
        </nav>
        <button onClick={onLaunchApp} className="btn-launch">
          Live Demo dApp
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <h1>Premium Solana White-Label dApp Infrastructure</h1>
        <p>Bangun ekosistem utilitas token Anda dalam 24 jam. Kami menyediakan infrastruktur DeFi modular siap pakai yang MEV-Secure, Anti-Sybil, dan teroptimasi penuh untuk jaringan Solana.</p>
      </section>

      {/* PRICING PACKAGES SECTION */}
      <section id="pricing" className="pricing-section">
        <h2 className="section-title">Pilihan Paket DeFi Modular</h2>
        <p className="section-desc">Pilih kombinasi modul on-chain terbaik yang sesuai dengan anggaran dan tokenomics komunitas Anda.</p>

        <div className="pricing-grid">
          {pricingPackages.map((pkg, idx) => (
            <div key={idx} className={`pricing-card ${pkg.popular ? 'popular-card' : ''}`}>
              {pkg.popular && <div className="popular-badge">BEST SELLER</div>}
              <div>
                <h3 className="package-name">{pkg.name}</h3>
                <p className="package-desc">{pkg.desc}</p>
                <div className="package-price">{pkg.price}</div>
                <ul className="features-list">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx}><i className="fas fa-circle-check"></i> {feat}</li>
                  ))}
                </ul>
              </div>
              <a href="https://t.me/usernameTelegramAnda" target="_blank" rel="noopener noreferrer" className="btn-order">
                {pkg.price === "Hubungi Kami" ? "Konsultasi Sekarang" : "Beli Lisensi Paket"}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-desc">Jawaban teknis mengenai sistem deployment dan operasional dApp White-Label Zoniq Finance.</p>
        
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.q} <i className="fas fa-chevron-down" style={{ transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', color: '#94a3b8' }}></i>
            </div>
            <div className="faq-answer" style={{
              paddingTop: activeFaq === index ? '20px' : '0px',
              paddingBottom: activeFaq === index ? '20px' : '0px',
              maxHeight: activeFaq === index ? '300px' : '0px'
            }}>
              {faq.a}
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 Zoniq Finance. All Rights Reserved. Premium Solana Software-as-a-Service Infrastructure.</p>
      </footer>
    </div>
  );
};

export default Landing;