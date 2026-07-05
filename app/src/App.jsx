import { useState, useEffect } from 'react';
import logoZoniq from './assets/image_436281.png'; 
import ComplianceModal from './components/ComplianceModal'; 
import ClientOnboardingForm from './components/ClientOnboardingForm'; 
import './App.css';
import DistributionLog from './components/DistributionLog'; 

// ==========================================================================
// KECERDASAN DETEKSI PAKET VIA LINK UTAMA (ANTI-GAGAL)
// ==========================================================================
const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const activePackage = urlParams ? urlParams.get('pkg') : null;
const currentViewParam = urlParams ? urlParams.get('view') : null; 
const currentDomain = typeof window !== 'undefined' ? window.location.hostname.replace('www.', '') : 'zoniqfi.com';

const SHOW_SWAP = activePackage !== 'whale' && activePackage !== 'staking';
const SHOW_OPTIMIZER = activePackage === 'velocity' || activePackage === 'staking' || !activePackage;
const SHOW_LOCKER = activePackage === 'whale' || activePackage === 'staking' || !activePackage;
const SHOW_AFFILIATE = activePackage !== 'staking';

const PROGRAM_ID = "HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD";
const SOLANA_NETWORK = "devnet (sandbox)"; 
const EMERGENCY_BURN_PENALTY_RATE = 0.10; 

const INITIAL_PRICES = { 
  SOL: 170.00, USDT: 1.00, USDC: 1.00, WSOL: 170.00, ZQI: 0.50, WIF: 2.50,     
  BONK: 0.00002, POPCAT: 1.10, RENDER: 7.80, JitoSOL: 185.00, JUP: 0.90, PYTH: 0.45
};

function App() {
  // ==========================================================================
  // STATE NAVIGASI UTAMA (SIDEBAR DESKTOP & DRAWER SLIDE HP)
  // ==========================================================================
  const [activeTab, setActiveTab] = useState('defi'); // Pilihan: 'defi', 'provizto', 'gateway'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State menu geser garis tiga di HP

  const [view, setView] = useState('dashboard'); 
  const [isConnected, setIsConnected] = useState(false);
  const [myWalletAddress, setMyWalletAddress] = useState("");
  const [activeProviderName, setActiveProviderName] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [securityBanner, setSecurityBanner] = useState({ show: false, message: "", type: "success" });
  
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [isLockLoading, setIsLockLoading] = useState(false);
  const [isTokenLocked, setIsTokenLocked] = useState(false);
  const [swapsCount, setSwapsCount] = useState(45210); 
  
  const [zqiBalance, setZqiBalance] = useState(0); 
  const [stakedAmount, setStakedAmount] = useState(0); 
  const [protocolTVL, setProtocolTVL] = useState(1248500);

  const [payAmount, setPayAmount] = useState('0');
  const [receiveAmount, setReceiveAmount] = useState('0.0');
  const [tokenPay, setTokenPay] = useState('USDC');
  const [tokenReceive, setTokenReceive] = useState('ZQI'); 
  const [swapFee, setSwapFee] = useState('0.0000');
  const [txLog, setTxLog] = useState('');
  const [distributionData, setDistributionData] = useState(null);

  const [calcAmount, setCalcAmount] = useState('0');
  const [projection, setProjection] = useState({ daily: "0.00", monthly: "0.00", annual: "0.00" });
  const [isVaultLoading, setIsVaultLoading] = useState(false);

  const [lockCalculationMode, setLockCalculationMode] = useState('manual'); 
  const [lockAmount, setLockAmount] = useState('0'); 
  const [chosenMultiplier, setChosenMultiplier] = useState(2.5); 
  const [liveScore, setLiveScore] = useState('0 ZQI Share'); 
  const [estimatedRewardText, setEstimatedRewardText] = useState('');
  const [showRewardRow, setShowRewardRow] = useState(false);
  const [earnedUsdcDisplay, setEarnedUsdcDisplay] = useState('0.00 USDC');
  const [rewardClaimable, setRewardClaimable] = useState(false);

  const [referrerInput, setReferrerInput] = useState('');
  const [referralVolume, setReferralVolume] = useState('$0.00');
  const [referralEarned, setReferralEarned] = useState('$0.00'); 
  const [tierLabel, setTierLabel] = useState('Bronze (10%)');
  const [tierColor, setTierColor] = useState('#14b8a6');
  const [tokenPrices, setTokenPrices] = useState(INITIAL_PRICES);

  // ==========================================================================
  // HOOKS LOGIKA ENGINE UTAMA (DI-MAINTAIN UTUH)
  // ==========================================================================
  useEffect(() => {
    window.onerror = function (message) {
      console.warn("[ZoniqFi Sandbox Guard] Suppressed error:", message);
      return true; 
    };

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const currentViewParam = urlParams ? urlParams.get('view') : null;
    if (currentViewParam === 'onboarding') {
      setView('onboarding-rahasia');
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProtocolTVL(prev => prev + (Math.floor(Math.random() * 600) - 150));
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const mints = [
          'So11111111111111111111111111111111111111112', 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', 
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 'EKpQGSJtjMFqKZ9KQGWjzCx4WnvZymCfLXaZNepvCSnM', 
          'DezXAZ8z7PnrnRJjz3wXqhAzBSrgJDuEUKvJaJZ5c9bA', '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', 
          'rndr4vtjaoz4aswbyf9rrpuf26rbyusa3ni1ttrbb2g', 'J1toso1uCk3RLmjorhTthVwY9vGf4wQrHz1w1idAQMJ', 
          'JUPyiwrYJGwHM4ZzN8TA73uYzY76mU8DLYA9bAqiJrxo', 'HZ12NQC9u1Ub9RE691bnh361fZbWq89fGs3Co393HX2g'  
        ];
        const response = await fetch(`https://api.jup.ag/price/v2?ids=${mints.join(',')}`);
        const json = await response.json();
        if (json && json.data) {
          setTokenPrices(prev => ({
            ...prev,
            SOL: parseFloat(json.data['So11111111111111111111111111111111111111112']?.price) || prev.SOL,
            WSOL: parseFloat(json.data['So11111111111111111111111111111111111111112']?.price) || prev.WSOL,
            USDT: parseFloat(json.data['Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB']?.price) || prev.USDT,
            USDC: parseFloat(json.data['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']?.price) || prev.USDC,
            WIF: parseFloat(json.data['EKpQGSJtjMFqKZ9KQGWjzCx4WnvZymCfLXaZNepvCSnM']?.price) || prev.WIF,
            BONK: parseFloat(json.data['DezXAZ8z7PnrnRJjz3wXqhAzBSrgJDuEUKvJaJZ5c9bA']?.price) || prev.BONK,
            POPCAT: parseFloat(json.data['7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr']?.price) || prev.POPCAT,
            RENDER: parseFloat(json.data['rndr4vtjaoz4aswbyf9rrpuf26rbyusa3ni1ttrbb2g']?.price) || prev.RENDER,
            JitoSOL: parseFloat(json.data['J1toso1uCk3RLmjorhTthVwY9vGf4wQrHz1w1idAQMJ']?.price) || prev.JitoSOL,
            JUP: parseFloat(json.data['JUPyiwrYJGwHM4ZzN8TA73uYzY76mU8DLYA9bAqiJrxo']?.price) || prev.JUP,
            PYTH: parseFloat(json.data['HZ12NQC9u1Ub9RE691bnh361fZbWq89fGs3Co393HX2g']?.price) || prev.PYTH
          }));
        }
      } catch (error) {
        console.warn("Jupiter Price sync bypass:", error);
      }
    };
    fetchLivePrices();
    const priceInterval = setInterval(fetchLivePrices, 30000);
    return () => clearInterval(priceInterval);
  }, []);

  const triggerBanner = (message, type = "success") => {
    setSecurityBanner({ show: true, message, type });
    setTimeout(() => setSecurityBanner(prev => ({ ...prev, show: false })), 4000);
  };

  const openWalletModal = () => isConnected ? disconnectWallet() : setIsModalOpen(true);

  const selectWallet = async (walletType) => {
    setIsModalOpen(false);
    setMyWalletAddress("DemoFx55SolanaPubKeyWalletAddressZQI");
    setActiveProviderName(walletType.toUpperCase());
    setIsConnected(true);
    setZqiBalance(7500.00);
    triggerBanner(`Linked via ${walletType} Sandbox!`, "success");
  };

  const disconnectWallet = () => {
    setMyWalletAddress(""); setActiveProviderName(""); setZqiBalance(0); setStakedAmount(0); setIsConnected(false); setIsTokenLocked(false);
    triggerBanner("Wallet disconnected.", "warning");
  };

  useEffect(() => {
    const amount = parseFloat(payAmount) || 0;
    setSwapFee((amount * 0.003).toFixed(4));
    const payTokenData = tokens.find(t => t.symbol === tokenPay);
    const receiveTokenData = tokens.find(t => t.symbol === tokenReceive);
    if (payTokenData && receiveTokenData) {
      setReceiveAmount(((amount * payTokenData.priceInUsdc) / receiveTokenData.priceInUsdc).toFixed(4));
    }
  }, [payAmount, tokenPay, tokenReceive, tokenPrices]);

  const handleTokenChange = (val) => {
    setTokenPay(val); setTokenReceive(val === 'ZQI' ? 'USDC' : 'ZQI'); 
  };

  const switchTokens = () => {
    const temp = tokenPay; setTokenPay(tokenReceive); setTokenReceive(temp); setPayAmount('');
  };

  const handleLaunchSwap = async () => {
    const amount = parseFloat(payAmount) || 0;
    if (amount <= 0) return;
    setIsSwapLoading(true); setTxLog(`Routing transaction bundle via Jito Engine MEV Protection...`);
    await new Promise(r => setTimeout(r, 2000));
    setSwapsCount(prev => prev + 1); setTxLog('');
    setDistributionData({
      fromAmount: `${amount} ${tokenPay}`, toAmount: `${receiveAmount} ${tokenReceive}`, totalFee: `${swapFee} ${tokenPay}`,
      breakdown: [
        { label: "Yield Optimizer Vault (40%)", amount: `${(swapFee * 0.4).toFixed(4)} ${tokenPay}`, icon: "fa-vault" },
        { label: "ZQI Real Yield Pool (30%)", amount: `${(swapFee * 0.3).toFixed(4)} ${tokenPay}`, icon: "fa-chart-pie" },
        { label: "Affiliate Treasury (15%)", amount: `${(swapFee * 0.15).toFixed(4)} ${tokenPay}`, icon: "fa-users" },
        { label: "Project Operations (15%)", amount: `${(swapFee * 0.15).toFixed(4)} ${tokenPay}`, icon: "fa-server" },
      ]
    });
    if (tokenReceive === 'ZQI') setZqiBalance(prev => prev + parseFloat(receiveAmount));
    alert(`🎉 Swap Successful inside Sandbox!`);
  };

  useEffect(() => {
    const amount = parseFloat(calcAmount) || 0;
    setProjection({
      daily: (amount * 0.0011).toFixed(2),
      monthly: (amount * (Math.pow(1 + 0.0011, 30) - 1)).toFixed(2),
      annual: (amount * (Math.pow(1 + 0.0011, 365) - 1)).toFixed(2)
    });
  }, [calcAmount]);

  const handleDepositVault = async () => {
    const val = parseFloat(calcAmount) || 0;
    if (val <= 0) return;
    setIsVaultLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setProtocolTVL(p => p + val); setIsVaultLoading(false);
    triggerBanner(`Deposited ${val} USDC into Compounding Vault!`, "success");
  };

  const switchLockCalculationView = (mode) => {
    if (isTokenLocked) return;
    setLockCalculationMode(mode); setLockAmount('0');
  };

  useEffect(() => {
    if (isTokenLocked) return;
    const amount = parseFloat(lockAmount) || 0;
    if (lockCalculationMode === 'manual') {
      setLiveScore(`${amount.toLocaleString()} ZQI Share`);
      setEstimatedRewardText(amount > 0 ? `Estimated Accumulation: +${(amount * 0.05).toFixed(2)} USDC` : '');
    } else {
      setLiveScore(`${(amount * chosenMultiplier).toLocaleString()} ZQI Share`);
      setEstimatedRewardText(amount > 0 ? `Estimated Accumulation: +${((amount * 0.05) * chosenMultiplier).toFixed(2)} USDC` : '');
    }
  }, [lockAmount, lockCalculationMode, chosenMultiplier, isTokenLocked]);

  const handleLockToken = async () => {
    const amount = parseFloat(lockAmount) || 0;
    if (amount <= 0 || amount > zqiBalance) return;
    setIsLockLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsTokenLocked(true); setStakedAmount(amount); setZqiBalance(p => p - amount);
    const multi = (lockCalculationMode === 'wizard') ? chosenMultiplier : 1;
    迫earnedUsdcDisplay(((amount * 0.05) * multi).toFixed(2) + " USDC");
    setEarnedUsdcDisplay(((amount * 0.05) * multi).toFixed(2) + " USDC");
    setShowRewardRow(true); setIsLockLoading(false);
    setTimeout(() => setRewardClaimable(true), 5000);
  };

  const claimVztReward = () => {
    if (!rewardClaimable) return;
    alert(`🎉 Yield rewards claimed safely.`);
    setShowRewardRow(false);
  };

  const handleEmergencyUnlock = async () => {
    if (stakedAmount <= 0) return;
    const ok = confirm(`Execute early withdrawal with 10% penalty?`);
    if (!ok) return;
    setZqiBalance(p => p + (stakedAmount * 0.9));
    setStakedAmount(0); setIsTokenLocked(false); setShowRewardRow(false);
    triggerBanner("Tokens unlocked with early withdrawal penalty fee burned.", "warning");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${currentDomain}?ref=${myWalletAddress}`);
    triggerBanner("📋 Copied Link to Clipboard!", "success");
  };

  const verifyReferralOnChain = () => {
    const simulatedVolume = Math.floor(Math.random() * 145000) + 5000;
    setReferralVolume(`$${simulatedVolume.toLocaleString()}`);
    let rate = 0.10;
    if (simulatedVolume <= 10000) { setTierLabel("Bronze (10%)"); setTierColor("#14b8a6"); rate = 0.10; }
    else if (simulatedVolume <= 100000) { setTierLabel("Silver (18%)"); setTierColor("#3b82f6"); rate = 0.18; }
    else { setTierLabel("Gold (25%)"); setTierColor("#a855f7"); rate = 0.25; }
    setReferralEarned(`$${(simulatedVolume * rate).toLocaleString()} USDC`);
  };

  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', priceInUsdc: tokenPrices.USDC },
    { symbol: 'USDT', name: 'Tether', priceInUsdc: tokenPrices.USDT },
    { symbol: 'SOL', name: 'Solana', priceInUsdc: tokenPrices.SOL },
    { symbol: 'WSOL', name: 'Wrapped Solana', priceInUsdc: tokenPrices.WSOL },
    { symbol: 'ZQI', name: 'ZoniqFi Token', priceInUsdc: tokenPrices.ZQI },
    { symbol: 'WIF', name: 'dogwifhat', priceInUsdc: tokenPrices.WIF },
    { symbol: 'BONK', name: 'Bonk Coin', priceInUsdc: tokenPrices.BONK },
    { symbol: 'POPCAT', name: 'Popcat', priceInUsdc: tokenPrices.POPCAT },
    { symbol: 'RENDER', name: 'Render Token', priceInUsdc: tokenPrices.RENDER },
    { symbol: 'JitoSOL', name: 'Jito Staked SOL', priceInUsdc: tokenPrices.JitoSOL },
    { symbol: 'JUP', name: 'Jupiter', priceInUsdc: tokenPrices.JUP },
    { symbol: 'PYTH', name: 'Pyth Network', priceInUsdc: tokenPrices.PYTH }
  ];

  if (view === 'onboarding-rahasia') {
    return <ClientOnboardingForm />;
  }

  return (
    <div id="vzt-enterprise-shell">
      {/* ==================================================================== */}
      {/* CORE FRAMEWORK SIDEBAR NAV CSS (DESKTOP ELEGANT & HP FLUID DRAWER) */}
      {/* ==================================================================== */}
      <style>{`
        #vzt-enterprise-shell { display: flex; background-color: #0b0f19; color: #f3f4f6; min-height: 100vh; font-family: 'Inter', sans-serif; }
        
        .vzt-sidebar { width: 280px; background: #0f172a; border-right: 1px solid #1e2937; display: flex; flex-direction: column; padding: 24px; position: fixed; height: 100vh; z-index: 9999; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .vzt-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
        .vzt-brand h2 { font-size: 1.25rem; font-weight: 800; letter-spacing: 1px; color: #fff; margin:0; }
        
        .vzt-menu-list { display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0; margin: 0; }
        .vzt-menu-item { padding: 14px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem; color: #94a3b8; display: flex; align-items: center; gap: 12px; transition: all 0.2s; }
        .vzt-menu-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
        .vzt-menu-item.active { background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #fff; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25); }
        
        .vzt-main-content { flex: 1; margin-left: 280px; padding: 30px 4%; min-width: 0; display: flex; flex-direction: column; }
        
        .vzt-hamburger-btn { display: none; position: fixed; top: 16px; left: 16px; background: #1e2937; border: 1px solid #374151; color: #fff; padding: 10px 14px; border-radius: 8px; cursor: pointer; z-index: 10000; font-size: 1.2rem; }
        
        .vzt-showcase-hero { background: radial-gradient(circle at center, #111827 0%, #060911 100%); padding: 60px 40px; border-radius: 20px; border: 1px solid #1f2937; text-align: center; margin-top: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .vzt-showcase-title { font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0 0 16px 0; background: linear-gradient(90deg, #fff 50%, #14b8a6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .vzt-showcase-desc { color: #94a3b8; font-size: 1.05rem; line-height: 1.6; max-width: 680px; margin: 0 auto 30px auto; }
        .vzt-showcase-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; font-weight: 700; border-radius: 10px; text-decoration: none; font-size: 1rem; transition: all 0.2s; border: none; cursor: pointer; }
        .vzt-btn-cyan { background: #14b8a6; color: #fff; box-shadow: 0 4px 14px rgba(20, 184, 166, 0.3); }
        .vzt-btn-cyan:hover { background: #0d9488; transform: translateY(-1px); }
        .vzt-btn-blue { background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%); color: #fff; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3); }
        .vzt-btn-blue:hover { opacity: 0.95; transform: translateY(-1px); }

        @media (max-width: 1024px) {
          .vzt-hamburger-btn { display: block; }
          .vzt-sidebar { transform: translateX(-100%); }
          .vzt-sidebar.mobile-open { transform: translateX(0); }
          .vzt-main-content { margin-left: 0; padding-top: 75px; }
        }
      `}</style>

      <ComplianceModal />

      {/* 📱 TOMBOL GARIS TIGA DRAWER (HP ONLY) */}
      <button className="vzt-hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* 🧭 NAVIGATION SIDEBAR KIRI */}
      <aside className={`vzt-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="vzt-brand">
          <img src={logoZoniq} alt="ZoniqFi Core Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <h2>ZONIQFI CORE</h2>
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

        {/* SIDEBAR REVENUE INTERACTION CONTROL */}
        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid #1e2937' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Secure Workspace Session</span>
          <button onClick={openWalletModal} style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '6px', background: isConnected ? '#22c55e' : '#2563eb', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            {isConnected ? `Linked: ${myWalletAddress.slice(0,4)}...` : 'Connect Core'}
          </button>
        </div>
      </aside>

      {/* 💻 MAIN RUANG KERJA SEBELAH KANAN */}
      <main className="vzt-main-content">
        
        {/* ==================================================================== */}
        {/* TAB 1: INTERAKTIF UTAMA (DEX SWAP, LOCKER, OPTIMIZER, AFFILIATE ASLI) */}
        {/* ==================================================================== */}
        {activeTab === 'defi' && (
          <div className="dapp-container" style={{ width: '100%' }}>
            <div className="wallet-status" style={{ color: isConnected ? "#22c55e" : "#94a3b8", marginBottom: '10px' }}>
              {isConnected ? `Wallet Status: Connected to Solana Devnet via ${activeProviderName}` : "Wallet Status: Disconnected (Network: Solana)"}
            </div>
            
            <div className="rpc-status-container" style={{ marginBottom: '20px' }}>
              <span className="rpc-status-indicator"></span>
              <span>RPC Node Status: Operational ({SOLANA_NETWORK})</span>
            </div>

            {txLog && <div className="security-banner" style={{ display: 'block', background: '#111827', color: '#38bdf8', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontStyle: 'italic' }}>{txLog}</div>}
            {distributionData && <DistributionLog programId={PROGRAM_ID} swapData={distributionData} />}

            <section className="products-grid">
              {/* MODUL 1: AMM DEX SWAP */}
              {SHOW_SWAP && (
                <div className="product-card swap-card">
                  <div className="card-title-row">
                    <h3>AMM DEX Swap</h3>
                    <span className="mev-secure-badge">🛡️ MEV SECURE</span>
                  </div>
                  <p className="desc">Instant asset swapping with MEV protection and daily Anti-Wash Trading features.</p>

                  <div className="swap-input-container">
                    <label>You Pay</label>
                    <div className="field-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#090d16', padding: '4px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <input type="number" placeholder="0.0" value={payAmount === '0' ? '' : payAmount} disabled={isSwapLoading} onChange={(e) => setPayAmount(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '1.1rem' }} />
                      <select value={tokenPay} onChange={(e) => handleTokenChange(e.target.value)} style={{ background: '#0b0f19', color: '#fff', border: '1px solid #334155', padding: '6px' }}>
                        {tokens.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="swap-switch-row"><button className="btn-switch-tokens" onClick={switchTokens}>⇅</button></div>

                  <div className="swap-input-container">
                    <label>You Receive (Estimated)</label>
                    <div className="field-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#090d16', padding: '4px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                      <input type="text" value={receiveAmount} readOnly style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
                      <span style={{ fontWeight: '800', color: '#38bdf8' }}>{tokenReceive}</span>
                    </div>
                  </div>

                  <div className="swap-fee-details">
                    <div className="detail-line"><span>Trading Fee (0.3%):</span><span>{swapFee} {tokenPay}</span></div>
                  </div>

                  <button className="btn-action" onClick={isConnected ? handleLaunchSwap : openWalletModal}>
                    {isSwapLoading ? 'Processing Secure Swap...' : !isConnected ? 'Connect Wallet' : 'Launch Swap'}
                  </button>
                </div>
              )}

              {/* MODUL 2: YIELD OPTIMIZER */}
              {SHOW_OPTIMIZER && (
                <div className="product-card">
                  <h3>Yield Optimizer</h3>
                  <p className="desc">Deposit once, the system automatically executes periodic auto-compounding optimization.</p>
                  <div className="stat-box">Boosted APY: Up to 49.1%</div>

                  <div className="yield-calc-embed">
                    <h4>Yield Calculator</h4>
                    <input type="number" placeholder="0.0" value={calcAmount === '0' ? '' : calcAmount} disabled={isVaultLoading} onChange={(e) => setCalcAmount(e.target.value)} />
                    <div className="projection-metrics-list">
                      <p>Est. Profit / Month: <strong>{parseFloat(projection.monthly).toLocaleString()} USDC</strong></p>
                    </div>
                  </div>

                  <button className="btn-action" onClick={isConnected ? handleDepositVault : openWalletModal}>
                    {isVaultLoading ? "Processing..." : !isConnected ? "Connect Wallet" : "Open Vaults"}
                  </button>
                </div>
              )}

              {/* MODUL 3: LOCK & YIELD */}
              {SHOW_LOCKER && (
                <div className="product-card">
                  <h3>ZQI Lock & Yield</h3>
                  <p className="desc">Lock tokens to claim Real Yield in stable USDC. Early unlock incurs 10% burn penalty.</p>
                  
                  <div className="calc-tabs">
                    <button className={`tab-btn ${lockCalculationMode === 'manual' ? 'active' : ''}`} onClick={() => switchLockCalculationView('manual')}>Instant Lock</button>
                    <button className={`tab-btn ${lockCalculationMode === 'wizard' ? 'active' : ''}`} onClick={() => switchLockCalculationView('wizard')}>Boosted Lock</button>
                  </div>

                  <input type="number" value={lockAmount === '0' ? '' : lockAmount} disabled={isTokenLocked} onChange={(e) => setLockAmount(e.target.value)} style={{ width:'100%', padding:'10px', background:'#070a13', border:'1px solid #1e293b', borderRadius:'8px', color:'#fff', marginTop:'10px' }} />

                  {lockCalculationMode === 'wizard' && (
                    <div className="duration-btn-group" style={{ display:'flex', gap:'5px', marginTop:'10px' }}>
                      <button className={`btn-duration ${chosenMultiplier === 1 ? 'active' : ''}`} onClick={() => setChosenMultiplier(1)}>30D</button>
                      <button className={`btn-duration ${chosenMultiplier === 2.5 ? 'active' : ''}`} onClick={() => setChosenMultiplier(2.5)}>180D</button>
                    </div>
                  )}

                  <div className="score-preview" style={{ marginTop:'14px' }}><span>Yield Score:</span><strong>{liveScore}</strong></div>

                  {isTokenLocked && showRewardRow && (
                    <div style={{ display:'flex', justifyContent:'space-between', background:'#070a13', padding:'10px', borderRadius:'8px', marginTop:'10px' }}>
                      <span>Earned: {earnedUsdcDisplay}</span>
                      <button onClick={claimVztReward} disabled={!rewardClaimable} style={{ background:'#22c55e', border:'none', color:'#fff', padding:'4px 10px', borderRadius:'4px' }}>Claim</button>
                    </div>
                  )}

                  <button className="btn-action" onClick={isConnected ? handleLockToken : openWalletModal} disabled={isTokenLocked} style={{ marginTop:'14px' }}>
                    {isTokenLocked ? '✓ Token Locked' : 'Lock Token'}
                  </button>

                  <button className="btn-action" onClick={handleEmergencyUnlock} disabled={!isTokenLocked} style={{ marginTop: "10px", background:"rgba(239,68,68,0.1)", color:"#ef4444", border:"1px solid #ef4444" }}>
                    Emergency Early Unlock (10% Penalty)
                  </button>
                </div>
              )}
            </section>

            {/* MODUL 4: AFFILIATE REFERRAL ENGINE */}
            {SHOW_AFFILIATE && (
              <section className="affiliate-section" style={{ background: '#0b121f', border: '1px solid #1e293b', borderRadius: '12px', padding: '30px', marginTop: '30px' }}>
                <h3>⚡ Secure On-Chain Affiliate</h3>
                <input type="text" value={isConnected ? `https://${currentDomain}?ref=${myWalletAddress}` : "Connect wallet..."} readOnly style={{ width:'100%', padding:'12px', background:'#070a13', border:'1px solid #1e293b', color:'#fff', borderRadius:'8px', marginTop:'10px' }} />
                <button onClick={copyLink} style={{ marginTop:'10px', padding:'10px 20px', background:'#8b5cf6', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer' }}>Copy Referral Link</button>

                <div style={{ marginTop:'20px', display:'flex', gap:'10px' }}>
                  <input type="text" placeholder="Enter referrer wallet..." value={referrerInput} onChange={(e)=>setReferrerInput(e.target.value)} style={{ flex:1, padding:'10px', background:'#070a13', border:'1px solid #1e293b', color:'#fff', borderRadius:'6px' }} />
                  <button onClick={verifyReferralOnChain} style={{ background:'#3b82f6', color:'#fff', border:'none', padding:'0 20px', borderRadius:'6px' }}>Verify</button>
                </div>

                <div className="tier-stats" style={{ display:'flex', justifyContent:'space-between', background:'#070a13', padding:'16px', borderRadius:'8px', marginTop:'20px' }}>
                  <span>Tier: <strong style={{color:tierColor}}>{tierLabel}</strong></span>
                  <span>Volume: <strong>{referralVolume}</strong></span>
                  <span>Earned: <strong style={{color:'#22c55e'}}>{referralEarned}</strong></span>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: PORTAL LINK PROVIZTO.COM */}
        {/* ==================================================================== */}
        {activeTab === 'provizto' && (
          <div className="vzt-showcase-hero">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💎</div>
            <h1 className="vzt-showcase-title">Provizto ($VIZTO) Ecosystem Hub</h1>
            <p className="vzt-showcase-desc">
              The official institutional entry point to unlock high-yield automated DeFi pooling configurations on Solana. Accumulating $VIZTO grants operators direct clearance to MEV-shielded pipelines.
            </p>
            <a href="https://provizto.com" target="_blank" rel="noopener noreferrer" className="vzt-showcase-btn vzt-btn-cyan">
              Launch Provizto Portal <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: PORTAL LINK GATEWAY.ZONIQFI.COM */}
        {/* ==================================================================== */}
        {activeTab === 'gateway' && (
          <div className="vzt-showcase-hero">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</div>
            <h1 className="vzt-showcase-title">Enterprise B2B Settlement Gateway</h1>
            <p className="vzt-showcase-desc">
              A premium hybrid core routing framework bridging traditional localized transactional clearing houses directly into global decentralized ledgers via production-grade developer API configurations.
            </p>
            <a href="https://gateway.zoniqfi.com/landing.html" target="_blank" rel="noopener noreferrer" className="vzt-showcase-btn vzt-btn-blue">
              Launch Gateway Console <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        )}

      </main>

      {/* WALLET PILIHAN MODAL POPUP */}
      {isModalOpen && (
        <div id="walletModal" className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '420px', width: '95%' }}>
            <div className="modal-header"><h3>Select Sandbox Wallet</h3><button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>&times;</button></div>
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px 0' }}>
              <button className="wallet-option-btn" onClick={() => selectWallet('phantom')}>👻 Phantom</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('solflare')}>☀️ Solflare</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('okx')}>🌐 OKX Wallet</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('backpack')}>🎒 Backpack</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;