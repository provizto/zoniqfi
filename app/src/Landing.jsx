import React, { useState, useEffect } from 'react';
import logoZoniqLarge from './assets/image_436281.png';

// Mendeteksi domain dasar secara dinamis di level browser (menghapus format 'www.')
const currentDomain = typeof window !== 'undefined' ? window.location.hostname.replace('www.', '') : 'zoniqfi.com';
const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://zoniqfi.com';

// 🔥 PROPS ASLI KEMBALI UTUH: Menerima data traksi penjualan lisensi B2B SaaS
const Landing = ({ 
  activeClients = 48, 
  whiteLabelsLive = 19, 
  oneOffBuyers = 320, 
  onLaunchApp 
}) => {
  const [activeFaq, setActiveFaq] = useState(null);

  // 🔥 STATE BARU UNTUK INTERAKSI ENGINE WEB3 DIGITAL CORE (MOCK SIMULATION)
  const [settlementCurrency, setSettlementCurrency] = useState('IDR');
  const [targetWallet, setTargetWallet] = useState('0xe0F0ed0C7e64e21779615e90c884ec74B807778A');
  const [selectedProduct, setSelectedProduct] = useState('Premium Web3 UI Toolkit');
  const [billingValueText, setBillingValueText] = useState('Rp 1.620.000 (0.03 ETH Equiv)');
  const [operatorTargetId, setOperatorTargetId] = useState('1');
  const [operatorLedgerRate, setOperatorLedgerRate] = useState('0.05');

  // Automatically inject FontAwesome and Google Fonts directly into the DOM Head upon component mount
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
      // Clean up DOM Head when navigating away from this component
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
      if (document.head.contains(faLink)) document.head.removeChild(faLink);
    };
  }, []);

  // Efek dinamis untuk merubah Calculated Billing Value sesuai pilihan dropdown / mata uang
  useEffect(() => {
    if (selectedProduct === 'Enterprise SaaS License') {
      setBillingValueText(settlementCurrency === 'IDR' ? 'Rp 2.700.000 (0.05 ETH Equiv)' : '$165.00 USD (0.05 ETH Equiv)');
    } else if (selectedProduct === 'Developer API Access Token') {
      setBillingValueText(settlementCurrency === 'IDR' ? 'Rp 4.320.000 (0.08 ETH Equiv)' : '$264.00 USD (0.08 ETH Equiv)');
    } else {
      setBillingValueText(settlementCurrency === 'IDR' ? 'Rp 1.620.000 (0.03 ETH Equiv)' : '$99.00 USD (0.03 ETH Equiv)');
    }
  }, [selectedProduct, settlementCurrency]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // 🔥 PAKET HARGA & LINK DEMO DIKEMBALIKAN KE ASLINYA (MENGGUNAKAN SUBDOMAIN INTERNAL ZONIQFI)
  const pricingPackages = [
    {
      name: "Entry / Viral Launch",
      desc: "Perfect for micro-cap meme coins requiring instant viral traction and rapid trading volume acceleration.",
      features: ["AMM DEX Swap (Anti-MEV)", "Secure On-Chain Affiliate", "Anti-Sybil Engine Active", "Custom Brand UI/UX Tailoring", "Supports Phantom, Solflare, & Backpack"],
      price: "$499",
      demoLink: `https://entry.${currentDomain}/?pkg=entry` 
    },
    {
      name: "Token Velocity (3-in-1)",
      desc: "Our most popular package for active community tokens looking to mitigate heavy market selling pressure.",
      features: ["AMM DEX Swap (Anti-MEV Protection)", "Yield Optimizer Vaults (0.11% Daily)", "Secure On-Chain Affiliate System", "Custom Brand UI/UX & Live Deployment", "Lifetime Core Updates & Bug Fixes"],
      price: "$1,299",
      popular: true,
      demoLink: `https://velocity.${currentDomain}/?pkg=velocity` 
    },
    {
      name: "Whale Retention Suite",
      desc: "Engineered specifically to lock circulating supply and reward loyal long-term holders with stable yields.",
      features: ["ZQI Token Lock & Vesting Hub", "Real Yield Pool (USDC Distribution)", "Secure On-Chain Affiliate System", "Emergency Early Unlock (10% Burn Penalty)", "Full Deployment & Domain Routing Setup"],
      price: "$1,199",
      demoLink: `https://whale.${currentDomain}/?pkg=whale` 
    },
    {
      name: "Safe Staking Hub",
      desc: "A pure DeFi staking and asset management platform designed for serious utility projects without referral mechanisms.",
      features: ["Yield Optimizer Vaults (Auto-Compound)", "ZQI Token Lock & Vesting Hub", "Real Yield Pool (USDC Distribution)", "Emergency Early Unlock (10% Burn Penalty)", "Custom Smart Contract Parameter Adjustments"],
      price: "$1,099",
      demoLink: `https://staking.${currentDomain}/?pkg=staking` 
    },
    {
      name: "Ultimate DeFi Suite (4-in-1)",
      desc: "The complete financial ecosystem package designed for ultimate market dominance on the Solana network.",
      features: ["AMM DEX Swap (Anti-MEV Protection)", "Yield Optimizer Vaults (Auto-Compound)", "ZQI Token Lock Hub (Vesting System)", "Secure On-Chain Affiliate (Tiered Volume)", "Priority 24/7 Core Developer Support"],
      price: "$2,499",
      demoLink: currentOrigin
    },
    {
      name: "Ecosystem Hub / Custom Edition",
      desc: "Advanced custom on-chain infrastructure tailored to complex institutional protocol requirements.",
      features: ["Full 4-in-1 Complete Modular Feature Set", "Custom Tokenomics & Fee Allocation Routing", "Multi-Asset Smart Contract Settlement", "Advanced Proprietary Anti-Bot Mechanics", "Private On-Chain Infrastructure Consultation"],
      price: "Contact Us",
      demoLink: currentOrigin
    }
  ];

  const faqData = [
    { q: "What is ZoniqFi?", a: "ZoniqFi is a premium Web3 infrastructure provider offering turnkey, plug-and-play white-label DeFi dApps on the Solana blockchain. We empower project owners and developers to launch comprehensive utility suites instantly without writing code from scratch." },
    { q: "How does the White-Label licensing model work?", a: "Once you purchase a package, our team handles all frontend customization (logos, token tickers, brand colors, smart contract links) and deploys the fully functional dApp directly to your project's custom domain or subdomain." },
    { q: "Do I need to deploy expensive native smart contracts?", a: "Not necessarily. Our infrastructure is designed with a multi-tenant architecture. You can opt to plug directly into our pre-deployed, highly optimized Devnet programs to bypass costly Solana rent-exempt storage fees while keeping your frontend completely branded." },
    { q: "Is this infrastructure protected against automated exploits?", a: "Absolutely. The Swap module is equipped with MEV Secure protocols via Jito Engine to shield retail traders from malicious sandwich attacks. Additionally, the Affiliate ledger features strict Anti-Sybil cooldown rules to prevent multi-wallet referral manipulation." },
    { q: "Can I upgrade my dApp modules in the future?", a: "Yes. Our ecosystem is built entirely on a modular toggle system. If you launch with our Entry Package today and want to unlock the Staking or Yield Optimizer features later, we can activate them via simple environment variables without rebuilding your website." }
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
        #vzt-landing-page .hero { padding: 160px 8% 40px 8% !important; text-align: center !important; background: radial-gradient(circle at top, rgba(59, 130, 246, 0.15) 0%, transparent 60%) !important; }
        #vzt-landing-page .hero-logo-container { margin-bottom: 20px !important; display: flex !important; justify-content: center !important; align-items: center !important; }
        #vzt-landing-page .hero h1 { font-size: 3.2rem !important; font-weight: 800 !important; line-height: 1.3 !important; margin-bottom: 24px !important; background: linear-gradient(90deg, #fff 40%, #14b8a6) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }
        #vzt-landing-page .hero p { font-size: 1.2rem !important; color: #94a3b8 !important; max-width: 800px !important; margin: 0 auto !important; line-height: 1.6 !important; }

        #vzt-landing-page .metrics-banner { display: flex !important; justify-content: center !important; flex-wrap: wrap !important; gap: 30px !important; padding: 30px 8% !important; background: #111827 !important; margin: 40px 0 0 0 !important; border-top: 1px solid #1f2937 !important; border-bottom: 1px solid #1f2937 !important; }
        #vzt-landing-page .metric-item { text-align: center !important; min-width: 150px !important; flex: 1 !important; }
        #vzt-landing-page .metric-value { font-size: 1.8rem !important; font-weight: 800 !important; color: #14b8a6 !important; }
        #vzt-landing-page .metric-label { font-size: 0.8rem !important; color: #94a3b8 !important; text-transform: uppercase !important; letter-spacing: 1px !important; margin-top: 6px !important; }

        .vzt-promo-subbar { display: flex; justify-content: center; gap: 24px; font-size: 0.9rem; color: #d1d5db; background: #111827; border: 1px solid #1f2937; padding: 12px 24px; border-radius: 12px; max-width: 650px; margin: 30px auto 0 auto; }
        .vzt-promo-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; padding: 6px 16px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; }
        .vzt-promo-pulse { height: 8px; width: 8px; border-radius: 50%; background-color: #60a5fa; animation: vztPulse 2s infinite; }
        @keyframes vztPulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(96, 165, 251, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(96, 165, 251, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(96, 165, 251, 0); } }
        .vzt-cta-wrapper { max-width: 850px; margin: 50px auto 20px auto; text-align: center; }
        .vzt-cta-card { background: linear-gradient(180deg, #111827 0%, #060911 100%); border: 1px solid #1f2937; border-radius: 24px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .vzt-cta-title { font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 12px; }
        .vzt-cta-desc { font-size: 0.95rem; color: #94a3b8; max-width: 600px; margin: 0 auto 30px auto; line-height: 1.6; }
        .vzt-tg-btn { display: inline-flex; align-items: center; gap: 12px; background: linear-gradient(90deg, #7c3aed 0%, #2563eb 100%); color: #fff !important; font-weight: 700; font-size: 1.1rem; padding: 16px 36px; border-radius: 14px; text-decoration: none !important; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3); transition: all 0.3s ease; }
        .vzt-tg-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(124, 58, 237, 0.4); opacity: 0.95; }

        .vzt-showcase-btn { display: inline-block !important; color: #10b981 !important; text-decoration: none !important; font-size: 0.85rem !important; font-weight: 700 !important; border: 1px solid rgba(16, 185, 129, 0.3) !important; padding: 8px 20px !important; border-radius: 20px !important; background: rgba(16, 185, 129, 0.03) !important; margin-top: 25px !important; transition: all 0.3s ease !important; }
        .vzt-showcase-btn:hover { background: rgba(16, 185, 129, 0.1) !important; border-color: #10b981 !important; transform: translateY(-1px) !important; }

        #vzt-landing-page .pricing-section { padding: 40px 8% 60px 8% !important; }
        #vzt-landing-page .pricing-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 30px !important; margin-top: 40px !important; }
        #vzt-landing-page .pricing-card { background: #111827 !important; border: 1px solid #1f2937 !important; border-radius: 16px !important; padding: 35px 25px !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; position: relative !important; transition: border-color 0.3s, transform 0.3s !important; }
        #vzt-landing-page .pricing-card:hover { border-color: #3b82f6 !important; transform: translateY(-4px) !important; }
        #vzt-landing-page .pricing-card.popular-card { border: 2px solid #8b5cf6 !important; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.1) !important; }
        #vzt-landing-page .popular-badge { position: absolute !important; top: -14px; left: 25px; background: #8b5cf6 !important; color: #fff !important; font-size: 0.75rem !important; font-weight: 700 !important; padding: 4px 12px !important; border-radius: 20px !important; }
        #vzt-landing-page .package-name { font-size: 1.4rem !important; font-weight: 700 !important; color: #fff !important; margin: 0 0 10px 0 !important; }
        #vzt-landing-page .package-desc { font-size: 0.9rem !important; color: #94a3b8 !important; min-height: 45px !important; margin-bottom: 25px !important; line-height: 1.5 !important; }
        #vzt-landing-page .package-price { font-size: 2.2rem !important; font-weight: 800 !important; color: #14b8a6 !important; margin-bottom: 25px !important; }
        #vzt-landing-page .features-list { list-style: none !important; padding: 0 !important; margin: 0 0 25px 0 !important; }
        #vzt-landing-page .features-list li { font-size: 0.9rem !important; color: #d1d5db !important; margin-bottom: 12px !important; display: flex !important; align-items: center !important; gap: 10px !important; text-align: left !important; }
        #vzt-landing-page .features-list i { color: #14b8a6 !important; }
        
        #vzt-landing-page .btn-demo-link { background: transparent !important; color: #94a3b8 !important; text-align: center !important; padding: 10px !important; border-radius: 8px !important; font-weight: 600 !important; text-decoration: none !important; border: 1px solid #1f2937 !important; transition: all 0.3s ease !important; display: block !important; margin-bottom: 10px !important; font-size: 0.9rem !important; }
        #vzt-landing-page .btn-demo-link:hover { border-color: #14b8a6 !important; color: #14b8a6 !important; background: rgba(20, 184, 166, 0.02) !important; }

        #vzt-landing-page .btn-order { background: #1f2937 !important; color: #fff !important; text-align: center !important; padding: 12px !important; border-radius: 8px !important; font-weight: 600 !important; text-decoration: none !important; border: 1px solid #374151 !important; transition: background 0.3s !important; display: block !important; }
        #vzt-landing-page .pricing-card.popular-card .btn-order { background: linear-gradient(135deg, #8b5cf6, #3b82f6) !important; border: none !important; }
        #vzt-landing-page .btn-order:hover { background: #374151 !important; }
        #vzt-landing-page .pricing-card.popular-card .btn-order:hover { opacity: 0.9 !important; }
        #vzt-landing-page .faq-section { padding: 60px 8% 80px 8% !important; max-width: 900px !important; margin: 0 auto !important; }
        #vzt-landing-page .faq-section .section-title { text-align: center !important; }
        #vzt-landing-page .faq-section .section-desc { text-align: center !important; margin-bottom: 30px !important; }
        #vzt-landing-page .faq-item { background: #111827 !important; border: 1px solid #1f2937 !important; border-radius: 8px !important; margin-bottom: 15px !important; overflow: hidden !important; }
        #vzt-landing-page .faq-question { padding: 20px !important; font-weight: 600 !important; cursor: pointer !important; display: flex !important; justify-content: space-between !important; align-items: center; color: #fff !important; }
        #vzt-landing-page .faq-answer { padding: 0 20px !important; max-height: 0px; overflow: hidden !important; transition: max-height 0.3s ease, padding 0.3s ease !important; color: #94a3b8 !important; line-height: 1.6 !important; font-size: 0.95rem !important; text-align: left !important; }
        
        #vzt-landing-page footer { border-top: 1px solid #1f2937 !important; padding: 40px 8% !important; display: flex !important; justify-content: space-between !important; align-items: center !important; background: #060911 !important; }
        #vzt-landing-page .footer-social-row { display: flex !important; gap: 16px !important; align-items: center !important; }
        #vzt-landing-page .social-icon-btn { color: #64748b !important; font-size: 1.3rem !important; text-decoration: none !important; transition: color 0.2s ease, transform 0.2s ease !important; }
        #vzt-landing-page .social-icon-btn:hover { color: #38bdf8 !important; transform: scale(1.1) !important; }
        
        .section-title { font-size: 2rem !important; font-weight: 800 !important; color: #ffffff !important; margin-bottom: 10px !important; text-align: center !important; }
        .section-desc { font-size: 1rem !important; color: #94a3b8 !important; max-width: 600px !important; margin: 0 auto 40px auto !important; text-align: center !important; }

        /* 🔥 SCISSOR CSS: WEB3 DIGITAL CORE BRAND VISUALS (IMAGE_5F78B8 / IMAGE_5F7914) */
        .wdc-wrapper { background: #ffffff !important; color: #333333 !important; padding: 40px !important; border-radius: 16px !important; margin: 40px 8% !important; box-shadow: 0 10px 35px rgba(0,0,0,0.15) !important; font-family: 'Inter', sans-serif !important; }
        .wdc-header { display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 1px solid #e5e7eb !important; padding-bottom: 20px !important; margin-bottom: 25px !important; flex-wrap: wrap !important; gap: 15px !important; }
        .wdc-brand { text-align: left !important; }
        .wdc-title-row { display: flex !important; align-items: center !important; gap: 8px !important; font-size: 1.6rem !important; font-weight: 800 !important; color: #0f172a !important; }
        .wdc-subtitle { font-size: 0.9rem !important; color: #64748b !important; font-weight: 500 !important; margin-top: 4px !important; }
        .wdc-wallet-buttons { display: flex !important; gap: 8px !important; flex-wrap: wrap !important; }
        .wdc-btn-blue { background: #0066fe !important; color: #ffffff !important; font-weight: 600 !important; border: none !important; padding: 10px 18px !important; border-radius: 6px !important; cursor: pointer !important; font-size: 0.85rem !important; transition: opacity 0.2s !important; }
        .wdc-btn-blue:hover { opacity: 0.9 !important; }
        
        .wdc-broadcast-banner { background: #fff1f2 !important; border: 1px solid #fecdd3 !important; border-radius: 8px !important; padding: 15px 20px !important; color: #e11d48 !important; font-weight: 600 !important; font-size: 0.9rem !important; margin-bottom: 35px !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 10px !important; text-align: center !important; }
        .wdc-market-headline { text-center: center !important; font-size: 1.35rem !important; font-weight: 700 !important; color: #1e293b !important; margin-bottom: 25px !important; text-align: center !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; }
        
        .wdc-sku-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 24px !important; margin-bottom: 40px !important; }
        .wdc-sku-card { background: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 14px !important; overflow: hidden !important; box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important; display: flex !important; flex-direction: column !important; }
        .wdc-sku-header { padding: 35px 20px !important; text-align: center !important; color: #ffffff !important; font-size: 1.8rem !important; font-weight: 800 !important; letter-spacing: 0.5px !important; }
        .wdc-sku-h-01 { background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%) !important; }
        .wdc-sku-h-02 { background: linear-gradient(135deg, #0d9488 0%, #0ea5e9 100%) !important; }
        .wdc-sku-h-03 { background: linear-gradient(135deg, #f472b6 0%, #fb7185 100%) !important; }
        .wdc-sku-body { padding: 25px 20px !important; flex-grow: 1 !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; text-align: center !important; }
        .wdc-sku-title { font-size: 1.2rem !important; font-weight: 700 !important; color: #0f172a !important; margin: 0 0 10px 0 !important; }
        .wdc-sku-desc { font-size: 0.85rem !important; color: #64748b !important; line-height: 1.5 !important; margin-bottom: 20px !important; min-height: 40px !important; }
        .wdc-rate-label { font-size: 0.75rem !important; color: #94a3b8 !important; text-transform: uppercase !important; font-weight: 600 !important; letter-spacing: 0.5px !important; }
        .wdc-rate-val { font-size: 1.3rem !important; font-weight: 800 !important; color: #10b981 !important; margin: 4px 0 20px 0 !important; }
        .wdc-btn-buy-gray { background: #94a3b8 !important; color: #ffffff !important; font-weight: 700 !important; border: none !important; width: 100% !important; padding: 12px !important; border-radius: 8px !important; cursor: pointer !important; font-size: 0.9rem !important; transition: background 0.2s !important; }
        .wdc-btn-buy-gray:hover { background: #64748b !important; }

        .wdc-split-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 24px !important; margin-bottom: 24px !important; }
        .wdc-panel-blue { border: 1px solid #bfdbfe !important; background: #f8fafc !important; border-radius: 12px !important; padding: 25px !important; text-align: left !important; }
        .wdc-panel-orange { border: 1px solid #fef08a !important; background: #fffbeb !important; border-radius: 12px !important; padding: 25px !important; text-align: left !important; }
        .wdc-panel-purple { border: 1px solid #e9d5ff !important; background: #faf5ff !important; border-radius: 12px !important; padding: 20px 25px !important; text-align: left !important; }
        
        .wdc-p-title-blue { font-size: 1.15rem !important; font-weight: 700 !important; color: #1d4ed8 !important; margin: 0 0 12px 0 !important; display: flex !important; align-items: center; gap: 8px; }
        .wdc-p-title-orange { font-size: 1.15rem !important; font-weight: 700 !important; color: #d97706 !important; margin: 0 0 12px 0 !important; display: flex !important; align-items: center; gap: 8px; }
        .wdc-p-title-purple { font-size: 1.05rem !important; font-weight: 700 !important; color: #7c3aed !important; margin: 0 0 15px 0 !important; display: flex !important; align-items: center; gap: 8px; }
        
        .wdc-p-desc { font-size: 0.88rem !important; color: #475569 !important; line-height: 1.5 !important; margin-bottom: 20px !important; }
        .wdc-dashed-box { border: 1px dashed #cbd5e1 !important; background: #ffffff !important; border-radius: 8px !important; padding: 20px !important; text-align: center !important; font-size: 0.88rem !important; color: #1e3a8a !important; font-weight: 500 !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; }
        
        .wdc-form-label { display: block !important; font-size: 0.85rem !important; font-weight: 700 !important; color: #334155 !important; margin-bottom: 6px !important; margin-top: 14px !important; }
        .wdc-radio-group { display: flex !important; gap: 20px !important; margin-bottom: 4px !important; flex-wrap: wrap !important; }
        .wdc-radio-option { display: flex !important; align-items: center !important; gap: 6px !important; font-size: 0.85rem !important; font-weight: 600 !important; color: #334155 !important; cursor: pointer !important; }
        .wdc-input-text { width: 100% !important; padding: 10px 12px !important; border: 1px solid #cbd5e1 !important; border-radius: 6px !important; background: #ffffff !important; color: #333333 !important; font-size: 0.88rem !important; font-weight: 500 !important; outline: none !important; }
        .wdc-select { width: 100% !important; padding: 10px 12px !important; border: 1px solid #cbd5e1 !important; border-radius: 6px !important; background: #ffffff !important; color: #333333 !important; font-size: 0.88rem !important; font-weight: 600 !important; outline: none !important; cursor: pointer !important; }
        
        .wdc-billing-box { background: #ffffff !important; border: 1px solid #fed7aa !important; border-radius: 8px !important; padding: 12px 15px !important; font-size: 0.88rem !important; color: #334155 !important; text-align: center !important; margin: 18px 0 !important; font-weight: 500 !important; }
        .wdc-btn-orange { background: #ea580c !important; color: #ffffff !important; font-weight: 700 !important; border: none !important; width: 100% !important; padding: 14px !important; border-radius: 8px !important; cursor: pointer !important; font-size: 0.95rem !important; transition: opacity 0.2s !important; }
        .wdc-btn-orange:hover { opacity: 0.95 !important; }
        
        .wdc-management-row { display: flex !important; gap: 15px !important; align-items: center !important; flex-wrap: wrap !important; }
        .wdc-m-field { flex: 1 !important; min-width: 150px !important; }
        .wdc-btn-purple { background: #9333ea !important; color: #ffffff !important; font-weight: 700 !important; border: none !important; padding: 11px 24px !important; border-radius: 6px !important; cursor: pointer !important; font-size: 0.88rem !important; margin-top: 24px !important; transition: opacity 0.2s !important; }
        .wdc-btn-purple:hover { opacity: 0.95 !important; }

        @media (max-width: 1024px) { 
          #vzt-landing-page .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; } 
          .wdc-sku-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .wdc-split-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          #vzt-landing-page header { padding: 15px 5% !important; }
          #vzt-landing-page nav { display: none !important; }
          #vzt-landing-page .hero { padding-top: 140px !important; }
          #vzt-landing-page .hero h1 { font-size: 2.2rem !important; line-height: 1.3 !important; }
          #vzt-landing-page .metrics-banner { flex-direction: column !important; gap: 25px !important; text-align: center !important; }
          #vzt-landing-page .pricing-grid { grid-template-columns: 1fr !important; }
          #vzt-landing-page footer { flex-direction: column !important; gap: 20px !important; text-align: center !important; }
          .vzt-promo-subbar { flex-direction: column; gap: 10px; padding: 16px; }
          .vzt-tg-btn { width: 100%; justify-content: center; font-size: 1rem; padding: 14px 24px; }
          .vzt-cta-card { padding: 24px; }
          .wdc-wrapper { padding: 20px !important; margin: 20px 4% !important; }
          .wdc-sku-grid { grid-template-columns: 1fr !important; }
          .wdc-header { justify-content: center !important; text-align: center !important; }
          .wdc-brand { text-align: center !important; }
          .wdc-wallet-buttons { justify-content: center !important; }
        }
      `}</style>

      {/* NAVBAR HEADER WITH INTEGRATED LOGO */}
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
          <a href="#gateway-marketplace">Gateway Hub</a>
          <a href="#pricing">Packages</a>
          <a href="#faq">FAQ</a>
          <a href="https://t.me/zoniqfi" target="_blank" rel="noopener noreferrer">Contact</a>
        </nav>
        <button onClick={onLaunchApp} className="btn-launch">
          Live dApp Demo
        </button>
      </header>

      {/* HERO SECTION WITH HERO LOGO */}
      <section className="hero">
        <div className="hero-logo-container">
          <img 
            src={logoZoniqLarge} 
            alt="ZoniqFi Hero Logo" 
            style={{ 
              width: '110px', 
              height: '110px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.35))'
            }} 
          />
        </div>
        
        <div className="vzt-promo-badge">
          <span className="vzt-promo-pulse"></span>
          Solana B2B Infrastructure Engine v5.0
        </div>
        
        <h1>PREMIUM SOLANA dAPP INFRASTRUCTURE FOR YOUR TOKEN</h1>
        <p>Stop wasting months coding from scratch. Deploy plug-and-play, high-converting Solana dApp Ecosystems tailored specifically to accelerate your token's trading volume, secure long-term liquidity, and protect your chart from malicious bots.</p>

        <div className="vzt-promo-subbar">
          <div>💡 <strong>SaaS Model:</strong> One-time licensing</div>
          <div>🎨 <strong>White-Label:</strong> Fully branded</div>
          <div>❌ <strong>No Token Required:</strong> Pure cashflow</div>
        </div>

        {/* 🔥 PROVIZTO LIVE EXAMPLE REDIRECTION BUTTON AT HERO */}
        <div>
          <a href="https://provizto.com" target="_blank" rel="noopener noreferrer" className="vzt-showcase-btn">
            <i className="fas fa-external-link-alt" style={{ marginRight: '6px' }}></i>
            See an Live 4-in-1 Production Example (Provizto.com) →
          </a>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 🔥 INTEGRASI PANEL UTUH WEB3 DIGITAL CORE MARKETPLACE (IMAGE_5F78B8) 🔥 */}
      {/* ===================================================================== */}
      <section id="gateway-marketplace" className="wdc-wrapper">
        
        {/* Top Header Row */}
        <div className="wdc-header">
          <div className="wdc-brand">
            <div className="wdc-title-row">
              🏪 Web3 Digital Core
            </div>
            <div className="wdc-subtitle">Enterprise Hybrid B2B Whitelabel Gateway</div>
          </div>
          <div className="wdc-wallet-buttons">
            <button className="wdc-btn-blue" onClick={() => alert('Injected wallet connection triggered.')}>Connect Injected</button>
            <button className="wdc-btn-blue" onClick={() => alert('MetaMask wallet connection triggered.')}>Connect MetaMask</button>
            <button className="wdc-btn-blue" onClick={() => alert('Phantom wallet connection triggered.')}>Connect Phantom</button>
            <button className="wdc-btn-blue" onClick={() => alert('Backpack wallet connection triggered.')}>Connect Backpack</button>
          </div>
        </div>

        {/* System Broadcast Monitor Banner */}
        <div className="wdc-broadcast-banner">
          ⚡ System Broadcast Monitor: <br />
          ❌ Failed: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.
        </div>

        {/* Global Solutions Marketplace Title */}
        <div className="wdc-market-headline">
          🛒 Global Solutions Marketplace (Multi-Chain/Web3 Buy)
        </div>

        {/* 3 Column SKU Grid Layout exactly matching image_5f78b8.png */}
        <div className="wdc-sku-grid">
          
          {/* SKU-01 */}
          <div className="wdc-sku-card">
            <div className="wdc-sku-header wdc-sku-h-01">SKU-01</div>
            <div className="wdc-sku-body">
              <div>
                <h4 className="wdc-sku-title">Enterprise SaaS License</h4>
                <p className="wdc-sku-desc">Lifetime access token for the white-label B2B core software architecture.</p>
              </div>
              <div>
                <div className="wdc-rate-label">Settlement Rate:</div>
                <div className="wdc-rate-val">0.05 ETH</div>
                <button className="wdc-btn-buy-gray" onClick={() => alert('Please connect your enterprise wallet first.')}>Connect Wallet to Buy</button>
              </div>
            </div>
          </div>

          {/* SKU-02 */}
          <div className="wdc-sku-card">
            <div className="wdc-sku-header wdc-sku-h-02">SKU-02</div>
            <div className="wdc-sku-body">
              <div>
                <h4 className="wdc-sku-title">Developer API Access Token</h4>
                <p className="wdc-sku-desc">Production-grade API access for automated secure Web3 checkout integrations.</p>
              </div>
              <div>
                <div className="wdc-rate-label">Settlement Rate:</div>
                <div className="wdc-rate-val">0.08 ETH</div>
                <button className="wdc-btn-buy-gray" onClick={() => alert('Please connect your developer wallet first.')}>Connect Wallet to Buy</button>
              </div>
            </div>
          </div>

          {/* SKU-03 */}
          <div className="wdc-sku-card">
            <div className="wdc-sku-header wdc-sku-h-03">SKU-03</div>
            <div className="wdc-sku-body">
              <div>
                <h4 className="wdc-sku-title">Premium Web3 UI Toolkit</h4>
                <p className="wdc-sku-desc">Pre-built React components designed optimized for blockchain-fiat commerce.</p>
              </div>
              <div>
                <div className="wdc-rate-label">Settlement Rate:</div>
                <div className="wdc-rate-val">0.03 ETH</div>
                <button className="wdc-btn-buy-gray" onClick={() => alert('Please connect your UI engineering wallet first.')}>Connect Wallet to Buy</button>
              </div>
            </div>
          </div>

        </div>

        {/* ===================================================================== */}
        {/* 🔥 HYBRID ENGINE AND MANAGEMENT SECTION (IMAGE_5F7914) 🔥 */}
        {/* ===================================================================== */}
        <div className="wdc-split-row">
          
          {/* Left Panel: Global Database Order Logs */}
          <div className="wdc-panel-blue">
            <h3 className="wdc-p-title-blue">
              <i className="fas fa-database"></i> Global Database Order Logs
            </h3>
            <p className="wdc-p-desc">Unified dashboard recording incoming cross-border settlement event emissions.</p>
            <div className="wdc-dashed-box">
              <i className="fas fa-cube"></i> No dynamic billing data synchronized yet.
            </div>
          </div>

          {/* Right Panel: Hybrid International Fiat Settlement Engine */}
          <div className="wdc-panel-orange">
            <h3 className="wdc-p-title-orange">
              <i className="fas fa-credit-card"></i> Hybrid International Fiat Settlement Engine
            </h3>
            <p className="wdc-p-desc">Simulates Stripe Credit Card (USD) or localized QRIS (IDR) triggering automated relay mints.</p>
            
            <div className="wdc-form-label">1. Choose Target Currency Settlement Option:</div>
            <div className="wdc-radio-group">
              <label className="wdc-radio-option">
                <input 
                  type="radio" 
                  name="currency" 
                  value="USD" 
                  checked={settlementCurrency === 'USD'} 
                  onChange={(e) => setSettlementCurrency(e.target.value)} 
                />
                us United States Dolar (USD / Stripe Card)
              </label>
              <label className="wdc-radio-option">
                <input 
                  type="radio" 
                  name="currency" 
                  value="IDR" 
                  checked={settlementCurrency === 'IDR'} 
                  onChange={(e) => setSettlementCurrency(e.target.value)} 
                />
                id Indonesian Rupiah (IDR / QRIS)
              </label>
            </div>

            <div className="wdc-form-label">2. Target Client Wallet Destination Address:</div>
            <input 
              type="text" 
              className="wdc-input-text" 
              value={targetWallet} 
              onChange={(e) => setTargetWallet(e.target.value)} 
            />

            <div className="wdc-form-label">3. Select Solutions Product:</div>
            <select 
              className="wdc-select" 
              value={selectedProduct} 
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="Premium Web3 UI Toolkit">Premium Web3 UI Toolkit</option>
              <option value="Enterprise SaaS License">Enterprise SaaS License</option>
              <option value="Developer API Access Token">Developer API Access Token</option>
            </select>

            <div className="wdc-billing-box">
              Calculated Billing Value: <strong style={{ color: '#ea580c' }}>{billingValueText}</strong>
            </div>

            <button 
              className="wdc-btn-orange" 
              onClick={() => alert(`Simulating success gateway settlement routing to:\n${targetWallet}\n\nSettlement settled safely via decentralized liquidity rails.`)}
            >
              Simulate Successful Checkout via {settlementCurrency}
            </button>
          </div>

        </div>

        {/* Bottom Panel: Internal Management Panel */}
        <div className="wdc-panel-purple">
          <h3 className="wdc-p-title-purple">
            <i className="fas fa-wrench"></i> Internal Management Panel (Operator Only)
          </h3>
          <div className="wdc-management-row">
            <div className="wdc-m-field">
              <div className="wdc-form-label" style={{ marginTop: 0 }}>Product Target ID:</div>
              <input 
                type="text" 
                className="wdc-input-text" 
                value={operatorTargetId} 
                onChange={(e) => setOperatorTargetId(e.target.value)} 
              />
            </div>
            <div className="wdc-m-field">
              <div className="wdc-form-label" style={{ marginTop: 0 }}>New Ledger Rate (ETH):</div>
              <input 
                type="text" 
                className="wdc-input-text" 
                value={operatorLedgerRate} 
                onChange={(e) => setOperatorLedgerRate(e.target.value)} 
              />
            </div>
            <button 
              className="wdc-btn-purple" 
              onClick={() => alert(`Ledger price parameter update broadcasted:\nTarget SKU ID: ${operatorTargetId}\nRate Value: ${operatorLedgerRate} ETH`)}
            >
              Override Price Rate
            </button>
          </div>
        </div>

      </section>

      {/* BANNER METRIK ASLI */}
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

      {/* PRICING PACKAGES SECTION */}
      <section id="pricing" className="pricing-section">
        <h2 className="section-title">Modular DeFi Packages</h2>
        <p className="section-desc">Select the perfect combination of utility features aligned with your project budget and community tokenomics.</p>

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
              
              <div>
                <a href={pkg.demoLink} target="_blank" rel="noopener noreferrer" className="btn-demo-link">
                  <i className="fas fa-bolt" style={{ marginRight: '6px' }}></i> Try Live Demo
                </a>
                
                <a href="https://t.me/zoniqfi" target="_blank" rel="noopener noreferrer" className="btn-order">
                  {pkg.price === "Contact Us" ? "Consult with Developers" : "Acquire License"}
                </a>
              </div>

            </div>
          ))}
        </div>

        <div className="vzt-cta-wrapper">
          <div className="vzt-cta-card">
            <h2 className="vzt-cta-title">📥 READY TO LAUNCH YOUR dAPP IN LESS THAN 48 HOURS?</h2>
            <p className="vzt-cta-desc">Our deployment pipeline is fully optimized. Get your utility system live under your own domain and customized branding without technical friction.</p>
            
            <a 
              href="https://t.me/zoniqfi" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="vzt-tg-btn"
            >
              <i className="fab fa-telegram-plane" style={{ fontSize: '1.3rem' }}></i>
              Contact Core Developer on Telegram
            </a>
            
            <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '16px', fontStyle: 'italic' }}>
              *Please specify your preferred package name (Entry, Velocity, Whale, etc.) when reaching out for priority onboarding.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-desc">Quick technical answers regarding deployment, licensing, and protocol security mechanics.</p>
        
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
        <p>© 2026 ZoniqFi. All Rights Reserved. Premium Solana Software-as-a-Service Infrastructure.</p>
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