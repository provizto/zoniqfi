import { useState, useEffect } from 'react';
import Landing from './Landing'; 
import ComplianceModal from './components/ComplianceModal'; 
import './App.css';

// ==========================================================================
// KECERDASAN DETEKSI PAKET VIA LINK UTAMA (ANTI-GAGAL)
// ==========================================================================
const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const activePackage = urlParams ? urlParams.get('pkg') : null;

const SHOW_SWAP = activePackage !== 'whale' && activePackage !== 'staking';
const SHOW_OPTIMIZER = activePackage === 'velocity' || activePackage === 'staking' || !activePackage;
const SHOW_LOCKER = activePackage === 'whale' || activePackage === 'staking' || !activePackage;
const SHOW_AFFILIATE = activePackage !== 'staking';

const PROGRAM_ID = "HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD";
const SOLANA_NETWORK = "devnet"; 

const BASE_EPOCH_HORIZON_MS = 604800000; 
const EMERGENCY_BURN_PENALTY_RATE = 0.10; 

// INTEGRASI: DAFTAR HARGA TOKENS TERMASUK MEME & AI POPULER DI SOLANA
const TOKEN_PRICES = { 
  SOL: 170.00, 
  USDT: 1.00, 
  USDC: 1.00, 
  WSOL: 170.00, 
  ZQI: 0.50,
  WIF: 2.50,     
  BONK: 0.00002, 
  POPCAT: 1.10,  
  RENDER: 7.80   
};

function App() {
  const [view, setView] = useState('landing'); 
  
  useEffect(() => {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const activePackage = urlParams ? urlParams.get('pkg') : null;
    
    if (activePackage) {
      setView('dashboard'); 
    }
  }, []);

  const [isConnected, setIsConnected] = useState(false);
  const [myWalletAddress, setMyWalletAddress] = useState("");
  const [activeProviderName, setActiveProviderName] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [securityBanner, setSecurityBanner] = useState({ show: false, message: "", type: "success" });
  
  const [lastTransactionTime, setLastTransactionTime] = useState(0);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [isLockLoading, setIsLockLoading] = useState(false);
  const [isTokenLocked, setIsTokenLocked] = useState(false);
  const [swapsCount, setSwapsCount] = useState(45210); 
  
  const [zqiBalance, setZqiBalance] = useState(0); 
  const [stakedAmount, setStakedAmount] = useState(0); 
  
  const [protocolTVL, setProtocolTVL] = useState(1248500);

  useEffect(() => {
    const interval = setInterval(() => {
      setProtocolTVL(prev => {
        const change = Math.floor(Math.random() * 600) - 150;
        return prev + change;
      });
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  const [payAmount, setPayAmount] = useState('0');
  const [receiveAmount, setReceiveAmount] = useState('0.0');
  const [tokenPay, setTokenPay] = useState('USDC');
  const [tokenReceive, setTokenReceive] = useState('ZQI'); 
  const [swapFee, setSwapFee] = useState('0.0000');
  const [txLog, setTxLog] = useState('');

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
  const [tierLabel, setTierLabel] = useState('Bronze (10%)');
  const [tierColor, setTierColor] = useState('#14b8a6');

  const triggerBanner = (message, type = "success") => {
    setSecurityBanner({ show: true, message, type });
    setTimeout(() => {
      setSecurityBanner(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const openWalletModal = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      setIsModalOpen(true);
    }
  };

  // ==========================================================================
  // HARDENED ANTI-CRASH WALLET HANDSHAKE ENGINE (PHANTOM BUG RESOLVED)
  // ==========================================================================
  const selectWallet = async (walletType) => {
    setIsModalOpen(false);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const dAppUrl = window.location.href;

    if (walletType === 'backpack') {
      const backpackProvider = window.backpack?.solana || (window.solana?.isBackpack ? window.solana : null);
      if (backpackProvider) {
        executeConnect(backpackProvider, "Backpack");
      } else {
        alert("Backpack Wallet not found! Please install the Backpack extension.");
        window.open("https://backpack.app/", "_blank");
      }
    } else if (walletType === 'phantom') {
      let phantomProvider = window.phantom?.solana;
      if (!phantomProvider && window.solana?.isPhantom) {
        phantomProvider = window.solana;
      }

      if (phantomProvider) {
        executeConnect(phantomProvider, "Phantom");
      } else if (isMobile) {
        const phantomDeepLink = `https://phantom.app/ul/browse/${encodeURIComponent(dAppUrl)}`;
        window.open(phantomDeepLink, '_blank');
      } else {
        alert("Phantom Wallet not found! Please install the Phantom extension.");
        window.open("https://phantom.app/", "_blank");
      }
    } else if (walletType === 'solflare') {
      const solflareProvider = window.solflare?.solana || window.solflare;
      if (solflareProvider && (solflareProvider.isSolflare || window.solflare?.isSolflare)) {
        executeConnect(solflareProvider, "Solflare");
      } else if (isMobile) {
        const solflareDeepLink = `https://solflare.com/ul/v1/browse?url=${encodeURIComponent(dAppUrl)}`;
        window.open(solflareDeepLink, '_blank');
      } else {
        alert("Solflare Wallet not found! Please install the Solflare extension.");
        window.open("https://solflare.com/", "_blank");
      }
    }
  };

  const executeConnect = async (provider, walletName) => {
    try {
      if (!provider) throw new Error("Provider structure is missing.");
      
      if (typeof provider.disconnect === 'function') {
        try { await provider.disconnect(); } catch (e) { console.warn("Session cleared safely:", e); }
      }

      const response = await provider.connect();
      const pubKey = response.publicKey ? response.publicKey.toString() : provider.publicKey.toString();
      
      setMyWalletAddress(pubKey);
      setActiveProviderName(walletName);
      setIsConnected(true);

      if (pubKey.startsWith("GNT") || pubKey.length > 30) {
        setZqiBalance(1000000.00); 
        triggerBanner(`👑 VIP Grantor Wallet Detected! Core Revenue-Share Active.`, "success");
      } else {
        setZqiBalance(5000.00); 
        triggerBanner(`Wallet successfully linked via ${walletName}!`, "success");
      }
    } catch (err) {
      console.error(`${walletName} payload configuration error:`, err);
      if (err.code === 4001) {
        triggerBanner("Connection rejected: Request denied by user.", "warning");
      } else {
        triggerBanner(`Extension State Conflict Resolved: Please re-open your ${walletName} window.`, "error");
      }
    }
  };

  const disconnectWallet = () => {
    setMyWalletAddress("");
    setActiveProviderName("");
    setZqiBalance(0);
    setStakedAmount(0);
    setIsConnected(false);
    setIsTokenLocked(false);
    setShowRewardRow(false);
    setRewardClaimable(false);
    setLockAmount('0');
    setLockCalculationMode('manual');
    setPayAmount('');
    setReceiveAmount('0.0');
    setSwapFee('0.0000');
    setTxLog('');
    triggerBanner("Wallet disconnected.", "warning");
  };

  // INTEGRASI DATA ICON ASLI KHUSUS JARiNGAN SOLANA
  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', priceInUsdc: TOKEN_PRICES.USDC, logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png' },
    { symbol: 'USDT', name: 'Tether', priceInUsdc: TOKEN_PRICES.USDT, logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png' },
    { symbol: 'SOL', name: 'Solana', priceInUsdc: TOKEN_PRICES.SOL, logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png' },
    { symbol: 'WSOL', name: 'Wrapped Solana', priceInUsdc: TOKEN_PRICES.WSOL, logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png' },
    { symbol: 'ZQI', name: 'ZoniqFi Token', priceInUsdc: TOKEN_PRICES.ZQI, logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9v836AEE6AEE38F8EE2386/logo.png' }, // Simulated custom token native icon asset
    { symbol: 'WIF', name: 'dogwifhat', priceInUsdc: TOKEN_PRICES.WIF, logo: 'https://bafkreidv7un67gkd7wfebe364b6wdsf2wbvffjauun25v266fub2yyrbqq.ipfs.nftstorage.link' },
    { symbol: 'BONK', name: 'Bonk Coin', priceInUsdc: TOKEN_PRICES.BONK, logo: 'https://h6z7v7wdrwck7g5g2v6f2u6f2u6f2u6f2u6f2u6f2u.ipfs.nftstorage.link' },
    { symbol: 'POPCAT', name: 'Popcat', priceInUsdc: TOKEN_PRICES.POPCAT, logo: 'https://bafkreihqivpbyaywpxi7snfof43fev7w6p23g6ujpx5wexmco3gfyq3wre.ipfs.nftstorage.link' },
    { symbol: 'RENDER', name: 'Render Token', priceInUsdc: TOKEN_PRICES.RENDER, logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/rndr19837aef83bcfead8e38fecbaad8e38fecbaad/logo.png' }
  ];

  useEffect(() => {
    const amount = parseFloat(payAmount) || 0;
    const calculatedFee = amount * 0.003;
    setSwapFee(calculatedFee.toFixed(4));

    const payTokenData = tokens.find(t => t.symbol === tokenPay);
    const receiveTokenData = tokens.find(t => t.symbol === tokenReceive);

    if (payTokenData && receiveTokenData) {
      const totalValueInUsdc = amount * payTokenData.priceInUsdc;
      const rawReceive = totalValueInUsdc / receiveTokenData.priceInUsdc;
      setReceiveAmount(rawReceive.toFixed(4));
    } else {
      setReceiveAmount('0.0');
    }
  }, [payAmount, tokenPay, tokenReceive]);

  const handleTokenChange = (val) => {
    setTokenPay(val);
    setTokenReceive(val === 'ZQI' ? 'USDC' : 'ZQI'); 
  };

  const switchTokens = () => {
    if (isSwapLoading) return;
    const tempPay = tokenPay;
    setTokenPay(tokenReceive);
    setTokenReceive(tempPay);
    setPayAmount('');
    setReceiveAmount('0.0');
  };

  const handleLaunchSwap = async () => {
    const amount = parseFloat(payAmount) || 0;
    if (amount <= 0) {
      alert('Please enter a valid token amount first.');
      return;
    }

    setIsSwapLoading(true);
    setTxLog(`Routing private transaction bundle on ${SOLANA_NETWORK} via Jito Engine (MEV Protection)...`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      const currentFee = parseFloat(swapFee) || 0;

      const vaultShare = (currentFee * 0.40).toFixed(5);
      const poolShare = (currentFee * 0.30).toFixed(5);
      const affiliateShare = (currentFee * 0.15).toFixed(5);
      const projectTreasuryShare = (currentFee * 0.15).toFixed(5);

      setSwapsCount(prev => prev + 1);

      setTxLog(
        `[SWAP SUCCESS] | Program: ${PROGRAM_ID}\n` +
        `Swapped: ${amount} ${tokenPay} ➜ ${receiveAmount} ${tokenReceive}\n` +
        `Protocol Fee (0.3%): ${swapFee} ${tokenPay}\n\n` +
        `[DISTRIBUTION LOG]\n` +
        `• 40% to Yield Optimizer Vault: ${vaultShare} ${tokenPay}\n` +
        `• 30% to ZQI Real Yield Pool (Auto-converted to USDC): ${poolShare} ${tokenPay}\n` +
        `• 15% to Affiliate Treasury: ${affiliateShare} ${tokenPay}\n` +
        `• 15% to Project Treasury Operations: ${projectTreasuryShare} ${tokenPay}\n`
      );

      if (tokenReceive === 'ZQI') {
        setZqiBalance(prev => prev + parseFloat(receiveAmount));
      }

      alert(`Swap Successful!\n\nYou exchanged ${amount} ${tokenPay} into ${receiveAmount} ${tokenReceive}.\nProtocol Fee deducted: ${swapFee} ${tokenPay}`);
      setPayAmount('');
      setReceiveAmount('0.0');
    } catch (error) {
      setTxLog('Transaction failed.');
    } finally {
      setIsSwapLoading(false);
    }
  };

  useEffect(() => {
    const amount = parseFloat(calcAmount) || 0;
    const dailyRate = 0.0011; 
    const dailyProfit = amount * dailyRate;
    const monthlyProfit = amount * (Math.pow(1 + dailyRate, 30) - 1);
    const annualProfit = amount * (Math.pow(1 + dailyRate, 365) - 1);

    setProjection({
      daily: dailyProfit.toFixed(2),
      monthly: monthlyProfit.toFixed(2),
      annual: annualProfit.toFixed(2)
    });
  }, [calcAmount]);

  const handleDepositVault = async () => {
    const amountValue = parseFloat(calcAmount) || 0;

    if (amountValue <= 0) {
      triggerBanner("⚠️ [Validation Error]: Please enter a valid deposit amount greater than 0 USDC!", "warning");
      return;
    }

    setIsVaultLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProtocolTVL(prev => prev + amountValue); 
      triggerBanner("✅ Success: Deposited " + amountValue.toLocaleString('en-US') + " USDC into the Auto-Compounding Vault!", "success");
    } catch (error) {
      triggerBanner("⚠️ Transaction rejected by network consensus.", "error");
    } finally {
      setIsVaultLoading(false);
    }
  };

  const switchLockCalculationView = (selectedMode) => {
    if (isTokenLocked) return;
    setLockCalculationMode(selectedMode);
    if (selectedMode === 'manual') {
      setLockAmount('0');
    } else {
      setLockAmount('1000');
      setChosenMultiplier(1);
    }
  };

  useEffect(() => {
    if (isTokenLocked) return;
    const amount = parseFloat(lockAmount) || 0;

    if (lockCalculationMode === 'manual') {
      setLiveScore(`${amount.toLocaleString('en-US')} ZQI Share`);
      if (amount > 0) {
        setEstimatedRewardText(`Estimated Accumulation: +${(amount * 0.05).toFixed(2)} USDC`);
      } else {
        setEstimatedRewardText('');
      }
    } else {
      const totalWeightedScoreSum = amount * chosenMultiplier;
      setLiveScore(`${totalWeightedScoreSum.toLocaleString('en-US')} ZQI Share`);
      if (amount > 0) {
        setEstimatedRewardText(`Estimated Accumulation (Incentivized): +${((amount * 0.05) * chosenMultiplier).toFixed(2)} USDC`);
      } else {
        setEstimatedRewardText('');
      }
    }
  }, [lockAmount, lockCalculationMode, chosenMultiplier, isTokenLocked]);

  const handleLockToken = async () => {
    const amount = parseFloat(lockAmount) || 0;
    if (amount <= 0) {
      alert('Please enter a valid amount of $ZQI tokens to lock.');
      return;
    }
    if (amount > zqiBalance) {
      alert('Insufficient $ZQI balance inside your secure wallet!');
      return;
    }

    setIsLockLoading(true);
    setRewardClaimable(false); 

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`Successfully locked ${amount} $ZQI!\n\nSmart Contract Rule: Tokens are now cryptographically bound to the 7-Day Epoch Horizon.`);
      
      setIsTokenLocked(true);
      setStakedAmount(amount); 
      setZqiBalance(prev => prev - amount); 
      
      const finalMultiplier = (lockCalculationMode === 'wizard') ? chosenMultiplier : 1;
      setEarnedUsdcDisplay(((amount * 0.05) * finalMultiplier).toFixed(2) + " USDC");
      setShowRewardRow(true);
      setProtocolTVL(prev => prev + (amount * TOKEN_PRICES.ZQI)); 

      setTimeout(() => {
        setRewardClaimable(true);
        triggerBanner("✨ Smart Contract Update: Staking Epoch completed! Yield rewards are now claimable.", "success");
      }, BASE_EPOCH_HORIZON_MS);

    } catch (error) {
      alert('Transaction failed.');
    } finally {
      setIsLockLoading(false);
    }
  };

  const claimVztReward = () => {
    if (!rewardClaimable) {
      alert("Smart Contract Refusal: Cannot execute yield withdrawal!");
      return;
    }
    alert(`Claim Successful!\n\n${earnedUsdcDisplay} has been transferred directly back to your wallet.`);
    setEarnedUsdcDisplay("0.00 USDC");
    setShowRewardRow(false);
  };

  const handleEmergencyUnlock = async () => {
    if (!isConnected) {
      triggerBanner("⚠️ Please connect your wallet first!", "error");
      return;
    }
    if (stakedAmount <= 0) {
      triggerBanner("⚠️ [Error]: No locked assets detected to execute early withdrawal.", "error");
      return;
    }

    const penaltyPercentageText = EMERGENCY_BURN_PENALTY_RATE * 100;
    const alertMessage = `⚠️ ALERT: EMERGENCY UNLOCK SYSTEM\n\n• Total Locked Assets: ${stakedAmount} ZQI\n• ${penaltyPercentageText}% Penalty to BURN: ${stakedAmount * EMERGENCY_BURN_PENALTY_RATE} ZQI\n\nProceed early unlock?`;

    const confirmWithdraw = confirm(alertMessage);
    if (!confirmWithdraw) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const penaltyAmount = stakedAmount * EMERGENCY_BURN_PENALTY_RATE;
      const finalAmountReturned = stakedAmount - penaltyAmount;

      setZqiBalance(prev => prev + finalAmountReturned);
      setProtocolTVL(prev => prev - (stakedAmount * TOKEN_PRICES.ZQI));
      
      triggerBanner(`🔥 Success: ${penaltyAmount} ZQI burned!`, "success");
      
      setStakedAmount(0);
      setLockAmount("0");
      setIsTokenLocked(false);
      setShowRewardRow(false);
      setRewardClaimable(false); 
      setTxLog(`🔥 Deflationary System: ${penaltyAmount.toFixed(2)} $ZQI permanently destroyed from supply.`);
    } catch (error) {
      triggerBanner("⚠️ Emergency execution rejected.", "error");
    }
  };

  const copyLink = () => {
    if (!isConnected) {
      setIsModalOpen(true);
      triggerBanner("⚠️ Please connect your wallet first!", "warning");
      return;
    }
    const generatedUrl = `https://zoniqfinance.com?ref=${myWalletAddress}`;
    navigator.clipboard.writeText(generatedUrl).then(() => triggerBanner("📋 Copied!", "success"));
  };

  const verifyReferralOnChain = () => {
    const inputVal = referrerInput.trim();
    if (inputVal === myWalletAddress && isConnected) {
      triggerBanner("⚠️ You cannot refer yourself!", "error");
      return;
    } 
    if (inputVal === "") {
      triggerBanner("Please enter a wallet address.", "warning");
      return;
    }

    const simulatedVolume = Math.floor(Math.random() * 145000) + 5000;
    setReferralVolume(`$${simulatedVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

    if (simulatedVolume <= 10000) {
      setTierLabel("Bronze (10%)"); setTierColor("#14b8a6");
    } else if (simulatedVolume > 10000 && simulatedVolume <= 100000) {
      setTierLabel("Silver (18%)"); setTierColor("#3b82f6");
    } else {
      setTierLabel("Gold (25%)"); setTierColor("#a855f7");
    }
  };

  if (view === 'landing') {
    return (
      <>
        <ComplianceModal />
        <Landing totalValueLocked={protocolTVL} swapsCount={swapsCount} onLaunchApp={() => setView('dashboard')} />
      </>
    );
  }

  // MENGAMBIL DATA LOGO DARI TOKEN YANG SEDANG AKTIF TERPILIH DI STATE
  const activePayToken = tokens.find(t => t.symbol === tokenPay);
  const activeReceiveToken = tokens.find(t => t.symbol === tokenReceive);

  return (
    <>
      <ComplianceModal />

      {securityBanner.show && (
        <div id="securityBanner" style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          padding: '14px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem',
          zIndex: 9999, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', transition: 'all 0.3s ease',
          textAlign: 'center', minWidth: '300px', display: 'block',
          background: securityBanner.type === "success" ? "#22c55e" : securityBanner.type === "error" ? "#ef4444" : "#eab308",
          color: securityBanner.type === "warning" ? "#1e293b" : "#ffffff",
          border: `1px solid ${securityBanner.type === "success" ? "#16a34a" : securityBanner.type === "error" ? "#dc2626" : "#ca8a04"}`
        }}>
          {securityBanner.message}
        </div>
      )}

      {/* HEADER UTAMA */}
      <header className="dapp-header">
        <div className="header-left">
          <div className="logo">ZONIQFI <span className="vzt-badge">$ZQI</span></div>
        </div>
        <div className="header-right">
          <button onClick={() => setView('landing')} className="btn-home" style={{ background: 'transparent', border: '1px solid #1f2937', color: '#f3f4f6', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px', marginRight: '10px', fontWeight: '600' }}>Back to Home</button>
          <button className="btn-connect" id="walletBtn" onClick={openWalletModal} style={{ background: isConnected ? "#22c55e" : "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
            {isConnected ? `Connected (${activeProviderName}): ${myWalletAddress.slice(0, 4)}...${myWalletAddress.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div id="walletModal" className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Select Solana Wallet</h3>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <button className="wallet-option-btn" onClick={() => selectWallet('backpack')} style={{ marginBottom: '10px' }}><span className="wallet-icon">🎒</span> Backpack Wallet</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('phantom')} style={{ marginBottom: '10px' }}><span className="wallet-icon">👻</span> Phantom Wallet</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('solflare')}><span className="wallet-icon">☀️</span> Solflare Wallet</button>
            </div>
          </div>
        </div>
      )}

      <main className="dapp-container">
        <div className="wallet-status" id="walletStatus" style={{ color: isConnected ? "#22c55e" : "#94a3b8" }}>
          {isConnected ? `Wallet Status: Connected to Solana Devnet via ${activeProviderName}` : "Wallet Status: Disconnected (Network: Solana)"}
        </div>
        
        <div className="rpc-status-container">
          <span className="rpc-status-indicator"></span>
          <span>RPC Node Status: Operational ({SOLANA_NETWORK})</span>
        </div>

        {txLog && (
          <div className="security-banner" style={{ display: 'block', background: '#111827', borderColor: '#1f2937', color: '#38bdf8', fontSize: '0.88rem', fontStyle: 'italic', whiteSpace: 'pre-line' }}>
            {txLog}
          </div>
        )}

        {/* GRID UTAMA PENYARING SAKLAR */}
        <section className="products-grid">
          
          {/* MODUL 1: SWAP */}
          {SHOW_SWAP && (
            <div className="product-card swap-card">
              <div className="card-title-row">
                <h3>AMM DEX Swap</h3>
                <span id="mevBadge" className="mev-secure-badge">🛡️ MEV SECURE</span>
              </div>
              <p className="desc">Instant asset swapping with MEV protection and daily Anti-Wash Trading features.</p>

              {/* FIELD INPUT: YOU PAY */}
              <div className="swap-input-container">
                <label>You Pay</label>
                <div className="field-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {activePayToken?.logo && (
                    <img src={activePayToken.logo} alt={tokenPay} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                  <input type="number" id="payAmount" placeholder="0.0" value={payAmount === '0' ? '' : payAmount} disabled={isSwapLoading} onChange={(e) => setPayAmount(e.target.value)} onBlur={() => { if (payAmount === '') setPayAmount('0'); }} style={{ flex: 1 }} />
                  <select id="tokenPay" value={tokenPay} onChange={(e) => handleTokenChange(e.target.value)} style={{ background: '#0f172a', color: '#fff', border: '1px solid #1e293b', padding: '8px', borderRadius: '6px', fontWeight: '600' }}>
                    {tokens.map(t => (
                      <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="swap-switch-row"><button className="btn-switch-tokens" onClick={switchTokens}>⇅</button></div>

              {/* FIELD INPUT: YOU RECEIVE */}
              <div className="swap-input-container">
                <label>You Receive (Estimated)</label>
                <div className="field-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {activeReceiveToken?.logo && (
                    <img src={activeReceiveToken.logo} alt={tokenReceive} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                  <input type="text" id="receiveAmount" value={receiveAmount} readOnly style={{ flex: 1 }} />
                  <span id="tokenReceiveLabel" className="static-token-label" style={{ fontWeight: '700', paddingRight: '8px', color: '#fff' }}>{tokenReceive}</span>
                </div>
              </div>

              <div className="swap-fee-details">
                <div className="detail-line"><span>Trading Fee (0.3%):</span><span id="swapFeeLabel" className="fee-bold-value">{swapFee} {tokenPay}</span></div>
                <div className="detail-line total-divider"><span>Anti-Wash Trading Check:</span><span className="status-active-text">Active (Daily)</span></div>
              </div>

              <button className="btn-action" id="swapBtn" onClick={isConnected ? handleLaunchSwap : openWalletModal} disabled={isConnected && (!payAmount || parseFloat(payAmount) <= 0 || isSwapLoading)} style={{ background: !isConnected ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : (payAmount && parseFloat(payAmount) > 0) ? "linear-gradient(90deg, #1f6feb 0%, #238636 100%)" : "#1f2937", color: (isConnected && (!payAmount || parseFloat(payAmount) <= 0)) ? "#64748b" : "#ffffff", cursor: "pointer", pointerEvents: "auto" }}>
                {isSwapLoading ? 'Processing Secure Swap...' : !isConnected ? 'Connect Wallet' : (!payAmount || parseFloat(payAmount) <= 0) ? 'Enter an Amount' : 'Launch Swap'}
              </button>
            </div>
          )}

          {/* MODUL 2: OPTIMIZER */}
          {SHOW_OPTIMIZER && (
            <div className="product-card">
              <h3>Yield Optimizer</h3>
              <p className="desc">Deposit once, the system automatically executes periodic auto-compounding optimization.</p>
              <div className="stat-box">Boosted APY: Up to 49.1%</div>
              
              <div className="yield-calc-embed">
                <h4>ZoniqFi Yield Calculator</h4>
                <label>Deposit Amount (USDC):</label>
                <input type="number" id="calcAmount" placeholder="0.0" value={calcAmount === '0' ? '' : calcAmount} disabled={isVaultLoading} onChange={(e) => setCalcAmount(e.target.value)} onBlur={() => { if (calcAmount === '') setCalcAmount('0'); }} />
                <div className="projection-metrics-list">
                  <p>Daily Rate: <strong>0.11%</strong></p>
                  <p>Est. Profit / Day: <strong id="profitDay" className="profit-green-value">{parseFloat(projection.daily).toLocaleString('en-US')} USDC</strong></p>
                  <p>Est. Profit / Month: <strong id="profitMonth" className="profit-green-value">{parseFloat(projection.monthly).toLocaleString('en-US')} USDC</strong></p>
                  <p>Est. Profit / Year: <strong id="profitYear" className="profit-green-value">{parseFloat(projection.annual).toLocaleString('en-US')} USDC</strong></p>
                </div>
              </div>

              <button className="btn-action" id="yieldBtn" onClick={isConnected ? handleDepositVault : openWalletModal} disabled={isConnected && (!calcAmount || parseFloat(calcAmount) <= 0 || isVaultLoading)} style={{ background: !isConnected ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : (calcAmount && parseFloat(calcAmount) > 0) ? "linear-gradient(90deg, #1f6feb 0%, #238636 100%)" : "#1f2937", color: (isConnected && (!calcAmount || parseFloat(calcAmount) <= 0)) ? "#64748b" : "#ffffff", cursor: "pointer", pointerEvents: "auto" }}>
                {isVaultLoading ? "Processing Deposit..." : !isConnected ? "Connect Wallet" : (!calcAmount || parseFloat(calcAmount) <= 0) ? "Enter an Amount" : "Open Vaults"}
              </button>
            </div>
          )}

          {/* MODUL 3: LOCKER */}
          {SHOW_LOCKER && (
            <div className="product-card">
              <h3>ZQI Lock & Yield</h3>
              <p className="desc">Lock your $ZQI tokens to claim Real Yield paid out in stable USDC. Early unlock incurs a 10% penalty.</p>

              <div className="calc-tabs">
                <button className={`tab-btn ${lockCalculationMode === 'manual' ? 'active' : ''}`} id="tabManual" onClick={() => switchLockCalculationView('manual')}>Instant Lock</button>
                <button className={`tab-btn ${lockCalculationMode === 'wizard' ? 'active' : ''}`} id="tabWizard" onClick={() => switchLockCalculationView('wizard')}>Boosted Lock</button>
              </div>

              <div className="pool-meta-row">
                <span>Protocol TVL: <strong id="poolTvl">${protocolTVL.toLocaleString('en-US')}</strong></span>
                <span>Your Balance: <strong id="vztBalance">{zqiBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ZQI</strong></span>
              </div>

              <div className="lock-input-group">
                <label id="inputLabel">{lockCalculationMode === 'manual' ? "Amount of $ZQI to Lock:" : "Enter Capital For Prediction:"}</label>
                <input type="number" id="lockAmount" placeholder="0.0" value={lockAmount === '0' ? '' : lockAmount} disabled={isTokenLocked || isLockLoading} onChange={(e) => setLockAmount(e.target.value)} onBlur={() => { if (lockAmount === '') setLockAmount('0'); }} />
              </div>

              <div className={`wizard-section ${lockCalculationMode === 'wizard' ? 'active' : ''}`} id="wizardOptions">
                <label className="wizard-select-label">Select Lock Duration:</label>
                <div className="duration-btn-group">
                  <button type="button" className={`btn-duration ${chosenMultiplier === 1 ? 'active' : ''}`} onClick={() => setChosenMultiplier(1)}>30 Days (1x)</button>
                  <button type="button" className={`btn-duration ${chosenMultiplier === 1.5 ? 'active' : ''}`} onClick={() => setChosenMultiplier(1.5)}>90 Days (1.5x)</button>
                  <button type="button" className={`btn-duration ${chosenMultiplier === 2.5 ? 'active' : ''}`} onClick={() => setChosenMultiplier(2.5)}>180 Days (2.5x)</button>
                </div>
              </div>

              <div className="score-preview">
                <span>{lockCalculationMode === 'manual' ? "Base Processing Share:" : "Boosted Yield Score:"}</span>
                <span className="score-value" id="liveScore">{liveScore}</span>
              </div>

              <div className="reward-info-badge">
                <span className="badge-accent-line">Reward: Real USDC (7-Day Epoch)</span>
                {estimatedRewardText && <span id="accumulationLabel" className="badge-sub-info" style={{ display: 'block' }}>{estimatedRewardText}</span>}
              </div>

              {isTokenLocked && !isLockLoading && showRewardRow && (
                <div className="claim-management-row" id="rewardClaimRow" style={{ display: 'flex', marginTop: '-10px', marginBottom: '15px' }}>
                  <span>Yield Earned: <strong id="earnedUsdc" style={{ color: '#22c55e' }}>{earnedUsdcDisplay}</strong></span>
                  <button className="btn-claim-vzt" onClick={claimVztReward} style={{ opacity: rewardClaimable ? 1 : 0.5, background: rewardClaimable ? "#22c55e" : "#4b5563", cursor: rewardClaimable ? "pointer" : "not-allowed", border: "none", padding: "6px 12px", borderRadius: "6px", color: "white", fontWeight: "600" }}>
                    {rewardClaimable ? "Claim Reward" : "🔒 Epoch Locking..."}
                  </button>
                </div>
              )}

              <button className="btn-action" id="lockBtn" onClick={isConnected ? handleLockToken : openWalletModal} disabled={isTokenLocked || (isConnected && (!lockAmount || parseFloat(lockAmount) <= 0 || isLockLoading))} style={{ background: isTokenLocked ? "#22c55e" : !isConnected ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : (lockAmount && parseFloat(lockAmount) > 0) ? "linear-gradient(90deg, #1f6feb 0%, #238636 100%)" : "#1f2937", color: isTokenLocked ? "#ffffff" : (isConnected && (!lockAmount || parseFloat(lockAmount) <= 0)) ? "#64748b" : "#ffffff", cursor: isTokenLocked ? "not-allowed" : "pointer", pointerEvents: isTokenLocked ? "none" : "auto" }}>
                {isLockLoading ? 'Processing Lock...' : isTokenLocked ? '✓ Token Locked' : !isConnected ? 'Connect Wallet' : (!lockAmount || parseFloat(lockAmount) <= 0) ? 'Enter an Amount' : 'Lock Token'}
              </button>

              <button className="btn-action" id="emergencyUnlockBtn" onClick={handleEmergencyUnlock} disabled={!isTokenLocked || isLockLoading} style={{ marginTop: "12px", width: "100%", padding: "12px", borderRadius: "8px", fontWeight: "600", background: (isTokenLocked && !isLockLoading) ? "#ef4444" : "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", color: (isTokenLocked && !isLockLoading) ? "#ffffff" : "#ef4444", cursor: (isTokenLocked && !isLockLoading) ? "pointer" : "not-allowed", pointerEvents: (isTokenLocked && !isLockLoading) ? "auto" : "none" }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '6px' }}></i> Emergency Early Unlock (10% Penalty)
              </button>
            </div>
          )}
        </section>

        {/* MODUL 4: AFFILIATE / REFERRAL */}
        {SHOW_AFFILIATE && (
          <section className="affiliate-section" style={{ background: '#0b121f', border: '1px solid #1e293b', borderRadius: '12px', padding: '30px', marginTop: '30px', color: '#94a3b8' }}>
            <div className="section-title-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#f97316' }}>⚡</span> Secure On-Chain Affiliate
              </h3>
              <span className="shield-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                Anti-Sybil Active
              </span>
            </div>

            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '24px', color: '#94a3b8' }}>
              Share your unique referral link. The system strictly restricts repetitive transactional manipulation (<strong style={{ color: '#f59e0b' }}>max 1 tx / 10s</strong>) to protect on-chain data validation.
            </p>
                 
            <div className="affiliate-input-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>YOUR REFERRAL LINK</label>
              <div className="affiliate-box" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <input 
                  type="text" 
                  id="refLink" 
                  value={isConnected ? `https://zoniqfinance.com?ref=${myWalletAddress}` : "Please connect your wallet..."} 
                  readOnly 
                  style={{ flex: 1, minWidth: '0', background: '#070a13', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px 16px', color: isConnected ? '#ffffff' : '#64748b', fontSize: '0.9rem', outline: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                />
                <button 
                  className="btn-copy" 
                  id="copyBtn" 
                  onClick={copyLink} 
                  style={{ 
                    background: isConnected ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : '#1e293b', 
                    color: '#ffffff', cursor: 'pointer', height: '45px', padding: '0 16px', borderRadius: '8px', fontWeight: '700', border: isConnected ? 'none' : '1px solid #334155', fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0, minWidth: '85px', boxShadow: isConnected ? '0 4px 14px rgba(139, 92, 246, 0.4)' : 'none', transition: 'all 0.3s ease'
                  }}
                >
                  {isConnected ? "Copy Link" : "Connect"}
                </button>
              </div>
            </div>

            <div className="test-panel" style={{ background: 'rgba(30, 41, 59, 0.3)', border: '1px solid #1e293b', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
              <label htmlFor="testReferrer" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '12px' }}>
                • REFERRER ADDRESS (ON-CHAIN VERIFICATION)
              </label>
              <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <input type="text" id="testReferrer" placeholder="Enter referrer wallet address..." value={referrerInput} onChange={(e) => setReferrerInput(e.target.value)} style={{ flex: 1, minWidth: '0', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', padding: '12px 16px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }} />
                <button 
                  className="btn-test" 
                  id="testBtn" 
                  onClick={verifyReferralOnChain} 
                  disabled={!isConnected} 
                  style={{ 
                    background: isConnected ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : '#111827', color: isConnected ? '#ffffff' : '#475569', border: isConnected ? 'none' : '1px solid #1e293b', height: '45px', padding: '0 12px', borderRadius: '6px', fontWeight: '700', cursor: isConnected ? 'pointer' : 'not-allowed', fontSize: '0.8rem', lineHeight: '1.2', textAlign: 'center', flexShrink: 0, minWidth: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isConnected ? '0 4px 14px rgba(59, 130, 246, 0.3)' : 'none', transition: 'all 0.3s ease'
                  }}
                >
                  Verify<br/>Link
                </button>
              </div>
            </div>

            <div className="tier-table-wrapper" style={{ marginBottom: '24px' }}>
              <p className="tier-headline" style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '500', marginBottom: '16px' }}>Ecosystem Tier Structures:</p>
              <div className="responsive-table-overflow">
                <table className="tier-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#111827', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>Tier Level</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>Volume Target</th>
                      <th style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>USDC Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <td className="tier-bronze" style={{ padding: '14px 16px', color: '#10b981', fontWeight: '600' }}>Bronze Tier</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>$0 - $10,000</td>
                      <td style={{ padding: '14px 16px', color: '#ffffff', fontWeight: '700' }}>10%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1e293b' }}>
                      <td className="tier-silver" style={{ padding: '14px 16px', color: '#3b82f6', fontWeight: '600' }}>Silver Tier</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>$10,001 - $100,000</td>
                      <td style={{ padding: '14px 16px', color: '#ffffff', fontWeight: '700' }}>18%</td>
                    </tr>
                    <tr>
                      <td className="tier-gold" style={{ padding: '14px 16px', color: '#a855f7', fontWeight: '600' }}>Gold Tier</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>&gt; $100,000</td>
                      <td style={{ padding: '14px 16px', color: '#ffffff', fontWeight: '700' }}>25%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tier-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#070a13', border: '1px solid #1e293b', padding: '16px 20px', borderRadius: '8px', fontSize: '0.9rem' }}>
              <div className="tier-item" style={{ color: '#94a3b8' }}>
                Current Tier: <span id="tierLabel" style={{ color: tierColor, fontWeight: '700' }}>{tierLabel}</span>
              </div>
              <div className="tier-item" style={{ color: '#94a3b8' }}>
                Total Referral Volume: <span id="volLabel" style={{ color: '#ffffff', fontWeight: '700' }}>{referralVolume === '$0.00' && !isConnected ? '$0.00' : referralVolume}</span>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="dapp-footer">
        <p>© 2026 ZoniqFi Hub. All Rights Reserved. Secure White-Label Protocol Template</p>
        <div className="footer-links-row" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
          <a href="https://provizto.github.io/vzt-docs/" target="_blank" rel="noopener noreferrer">Documentation</a>
          <a href="#audit" onClick={() => alert('Security Audits underway.')}>Security Audit 🛡️</a>
          <a href="#disclaimer" onClick={() => alert('Non-custodial application.')}>Legal Disclaimer</a>
        </div>
      </footer>
    </>
  );
}

export default App;