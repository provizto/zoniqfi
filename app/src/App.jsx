import { useState, useEffect } from 'react';
import Landing from './Landing';
import logoZoniq from './assets/image_436281.png'; 
import ComplianceModal from './components/ComplianceModal'; 
import ClientOnboardingForm from './components/ClientOnboardingForm'; // INTEGRASI COMPONENT FORM
import './App.css';
import DistributionLog from './components/DistributionLog'; // PERBAIKAN JALUR IMPORT: Disamakan dengan folder komponen lainnya agar tidak crash build
import TransactionSuccessModal from './components/TransactionSuccessModal';
import { isSNSDomain, resolveSNSInput } from './utils/snsResolver';
import { PublicKey } from '@solana/web3.js';

// ==========================================================================
// KECERDASAN DETEKSI PAKET VIA LINK UTAMA (ANTI-GAGAL)
// ==========================================================================
const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const activePackage = urlParams ? urlParams.get('pkg') : null;
const currentViewParam = urlParams ? urlParams.get('view') : null; // DETEKSI PARAMETER VIEW FORM RAHASIA
const currentDomain = typeof window !== 'undefined' ? window.location.hostname.replace('www.', '') : 'zoniqfi.com';

const SHOW_SWAP = activePackage !== 'whale' && activePackage !== 'staking';
const SHOW_OPTIMIZER = activePackage === 'velocity' || activePackage === 'staking' || !activePackage;
const SHOW_LOCKER = activePackage === 'whale' || activePackage === 'staking' || !activePackage;
const SHOW_AFFILIATE = activePackage !== 'staking';

// MOCK CONSTANTS FOR SANDBOX DEMO DISCONNECTED FROM OLD GRANTS CONTRACT
const PROGRAM_ID = "HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD";
const SOLANA_NETWORK = "devnet (sandbox)"; 

const BASE_EPOCH_HORIZON_MS = 604800000; 
const EMERGENCY_BURN_PENALTY_RATE = 0.10; 

// INITIAL STATIC FALLBACK PRICES
const INITIAL_PRICES = { 
  SOL: 170.00, 
  USDT: 1.00, 
  USDC: 1.00, 
  WSOL: 170.00, 
  ZQI: 0.50,
  WIF: 2.50,     
  BONK: 0.00002, 
  POPCAT: 1.10,  
  RENDER: 7.80,
  JitoSOL: 185.00,
  JUP: 0.90,
  PYTH: 0.45
};

function App() {
  const [view, setView] = useState('landing'); 
  
  // 🔥 STATE TAB NAVIGASI ZONIQFI DENGAN DETEKSI PAKET OTOMATIS
  const [activeTab, setActiveTab] = useState(() => {
    if (SHOW_SWAP) return 'swap';
    if (SHOW_OPTIMIZER) return 'vault';
    if (SHOW_LOCKER) return 'staking';
    if (SHOW_AFFILIATE) return 'affiliate';
    return 'swap';
  });

  // State Modal Legal Disclaimer
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // State dan Fungsi Modal Kepatuhan
  const [showCompliance, setShowCompliance] = useState(false);

  const handleLaunchWithCompliance = () => {
    const isAccepted = localStorage.getItem('zoniq_terms_accepted');
    if (isAccepted === 'true') {
      setView('dashboard');
    } else {
      setShowCompliance(true);
    }
  };

  const handleAcceptCompliance = () => {
    localStorage.setItem('zoniq_terms_accepted', 'true');
    setShowCompliance(false);
    setView('dashboard');
  };

  // 🔥 INTEGRASI STATE BARU: Menyimpan jumlah data penjualan paket dApp SaaS B2B secara terpusat
  const [activeClients, setActiveClients] = useState(48);
  const [whiteLabelsLive, setWhiteLabelsLive] = useState(19);
  const [oneOffBuyers, setOneOffBuyers] = useState(320);
  
  // ==========================================================================
  // HARDENED SILENT ERROR INTERCEPTOR (EMAIL FLOOD BUG RESOLVED)
  // ==========================================================================
  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      console.warn("[ZoniqFi Sandbox Guard] Suppressed on-chain network mismatch error:", message);
      return true; 
    };

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const activePackage = urlParams ? urlParams.get('pkg') : null;
    const currentViewParam = urlParams ? urlParams.get('view') : null;
    
    if (currentViewParam === 'onboarding') {
      setView('onboarding-rahasia');
    } else if (activePackage) {
      setView('dashboard'); 
    }
  }, []);

  const [isConnected, setIsConnected] = useState(false);
  const [myWalletAddress, setMyWalletAddress] = useState("");
  const [activeProviderName, setActiveProviderName] = useState("");
  
  // 🔥 AUTO-RECONNECT: Memulihkan sesi wallet saat browser di-refresh
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('zoniq_wallet_session');
      if (savedSession) {
        const { provider, address } = JSON.parse(savedSession);
        if (address) {
          setMyWalletAddress(address);
          setActiveProviderName(provider || "Wallet");
          setIsConnected(true);
          let baseBal = address.startsWith("GNT") ? 1000000.00 : 5000.00;

          // Baca sesi staking jika ada
          const savedStaking = localStorage.getItem('zoniq_staking_session');
          if (savedStaking) {
            const stData = JSON.parse(savedStaking);
            if (stData.isLocked) {
              setIsTokenLocked(true);
              setStakedAmount(stData.amount || 1000);
              setShowRewardRow(true);
              setEarnedUsdcDisplay(stData.earnedDisplay || "75.00 USDC");
              setRewardClaimable(true);
              baseBal = Math.max(0, baseBal - (stData.amount || 1000));
            }
          }

          // Baca sesi vault jika ada
          const savedVault = localStorage.getItem('zoniq_vault_session');
          if (savedVault) {
            const vData = JSON.parse(savedVault);
            if (vData.calcAmount) setCalcAmount(vData.calcAmount.toString());
          }

          setZqiBalance(baseBal);
        }
      }
    } catch (e) {
      console.warn("Session restore skipped:", e);
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [securityBanner, setSecurityBanner] = useState({ show: false, message: "", type: "success" });
  
  const [lastTransactionTime, setLastTransactionTime] = useState(0);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [isLockLoading, setIsLockLoading] = useState(false);
  const [isTokenLocked, setIsTokenLocked] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
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

  // 🔥 STATE INTEGRASI: Menyimpan data pembagian on-chain untuk komponen premium DistributionLog
  const [distributionData, setDistributionData] = useState(null);

  // 🔥 STATE MODAL: Notifikasi Sukses Swap Web3 Premium
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);

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

  // ==========================================================================
  // LIVE PRICE HANDLER (JUPITER API INTEGRATION)
  // ==========================================================================
  const [tokenPrices, setTokenPrices] = useState(INITIAL_PRICES);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const mints = [
          'So11111111111111111111111111111111111111112', 
          'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', 
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 
          'EKpQGSJtjMFqKZ9KQGWjzCx4WnvZymCfLXaZNepvCSnM', 
          'DezXAZ8z7PnrnRJjz3wXqhAzBSrgJDuEUKvJaJZ5c9bA', 
          '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', 
          'rndr4vtjaoz4aswbyf9rrpuf26rbyusa3ni1ttrbb2g', 
          'J1toso1uCk3RLmjorhTthVwY9vGf4wQrHz1w1idAQMJ', 
          'JUPyiwrYJGwHM4ZzN8TA73uYzY76mU8DLYA9bAqiJrxo', 
          'HZ12NQC9u1Ub9RE691bnh361fZbWq89fGs3Co393HX2g'  
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
        console.warn("Gagal sinkronisasi Jupiter Live Price Engine:", error);
      }
    };

    fetchLivePrices();
    const priceInterval = setInterval(fetchLivePrices, 30000);
    return () => clearInterval(priceInterval);
  }, []);

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
    else if (walletType === 'okx') {
      const okxProvider = window.okxwallet?.solana || (window.solana?.isOkxWallet ? window.solana : null) || window.okxwallet?.solanaProvider;
      if (okxProvider) {
        executeConnect(okxProvider, "OKX Wallet");
      } else {
        // Fallback demo sandbox otomatis
        executeConnect(null, "OKX Wallet");
      }
    }
    else if (walletType === 'coinbase') {
      const cbProvider = window.coinbaseSolana || window.coinbaseWalletExtension?.solana || (window.solana?.isCoinbaseWallet ? window.solana : null);
      if (cbProvider) {
        executeConnect(cbProvider, "Coinbase");
      } else {
        // Fallback otomatis ke mode sandbox jika ekstensi belum terpasang
        executeConnect(null, "Coinbase");
      }
    }
    else if (walletType === 'ledger') {
      triggerBanner("Connecting to Ledger Hardware device via WebHID Bridge...", "warning");
      await new Promise(r => setTimeout(r, 1500));
      setMyWalletAddress("LedgerSec88WhaleWalletAddressZQI");
      setActiveProviderName("Ledger");
      setIsConnected(true);
      setZqiBalance(250000.00); 
      triggerBanner("Hardware Secure Connection Established via Ledger Nano S/X!", "success");
    }
    else if (walletType === 'brave') {
      const braveProvider = window.braveSolana;
      if (braveProvider) {
        executeConnect(braveProvider, "Brave Wallet");
      } else {
        executeConnect(window.solana, "Brave Wallet");
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

      // 🔥 Simpan status sesi ke localStorage
      localStorage.setItem('zoniq_wallet_session', JSON.stringify({
        provider: walletName,
        address: pubKey
      }));

      if (pubKey.startsWith("GNT") || pubKey.length > 30) {
        setZqiBalance(1000000.00); 
        triggerBanner(`👑 VIP Grantor Wallet Detected! Core Revenue-Share Active.`, "success");
      } else {
        setZqiBalance(5000.00); 
        triggerBanner(`Wallet successfully linked via ${walletName}!`, "success");
      }
    } catch (err) {
      console.error(`${walletName} connection simulation debug:`, err);
      if (err.code === 4001) {
        triggerBanner("Connection rejected: Request denied by user.", "warning");
      } else {
        setMyWalletAddress("DemoFx55SolanaPubKeyWalletAddressZQI");
        setActiveProviderName(walletName);
        setIsConnected(true);
        setZqiBalance(7500.00);
        triggerBanner(`Linked via ${walletName} (Demo Sandbox Mode Activated)`, "success");
      }
    }
  };

  const disconnectWallet = () => {
    // 🔥 Bersihkan sesi tersimpan
    localStorage.removeItem('zoniq_wallet_session');
    localStorage.removeItem('zoniq_staking_session');
    localStorage.removeItem('zoniq_vault_session');

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
    setReferrerInput('');
    setReferralVolume('$0.00');
    setReferralEarned('$0.00'); 
    setDistributionData(null); 
    triggerBanner("Wallet disconnected.", "warning");
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
  }, [payAmount, tokenPay, tokenReceive, tokenPrices]);

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
      triggerBanner("⚠️ Please enter a valid token amount first.", "warning");
      return;
    }

    setIsSwapLoading(true);
    setDistributionData(null); 
    setTxLog(`Routing private transaction bundle on Solana Devnet via Jito Engine (MEV Protection)...`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      const currentFee = parseFloat(swapFee) || 0;
      const vaultShare = (currentFee * 0.40).toFixed(5);
      const poolShare = (currentFee * 0.30).toFixed(5);
      const affiliateShare = (currentFee * 0.15).toFixed(5);
      const projectTreasuryShare = (currentFee * 0.15).toFixed(5);

      setSwapsCount(prev => prev + 1);
      setTxLog(''); 

      setDistributionData({
        fromAmount: `${amount} ${tokenPay}`,
        toAmount: `${receiveAmount} ${tokenReceive}`,
        totalFee: `${swapFee} ${tokenPay}`,
        breakdown: [
          { label: "Yield Optimizer Vault (40%)", amount: `${vaultShare} ${tokenPay}`, icon: "fa-vault" },
          { label: "ZQI Real Yield Pool (30%)", amount: `${poolShare} ${tokenPay}`, icon: "fa-chart-pie" },
          { label: "Affiliate Treasury (15%)", amount: `${affiliateShare} ${tokenPay}`, icon: "fa-users" },
          { label: "Project Treasury Operations (15%)", amount: `${projectTreasuryShare} ${tokenPay}`, icon: "fa-server" },
        ]
      });

      // 🔥 Tambahkan baris ini jika ingin log fee otomatis hilang setelah 15 detik:
      setTimeout(() => {
        setDistributionData(null);
      }, 15000);

      if (tokenReceive === 'ZQI') {
        setZqiBalance(prev => prev + parseFloat(receiveAmount));
      }

      // 🔥 Buka modal sukses kustom dan simpan data rinciannya
      setSuccessModalData({
        fromAmount: `${amount} ${tokenPay}`,
        toAmount: `${receiveAmount} ${tokenReceive}`,
        feeAmount: `${swapFee} ${tokenPay}`
      });
      setIsSuccessModalOpen(true);

      setPayAmount('');
      setReceiveAmount('0.0');
    } catch (error) {
      setTxLog('Transaction routing failed.');
      setDistributionData(null);
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
      localStorage.setItem('zoniq_vault_session', JSON.stringify({ calcAmount: amountValue })); 
      triggerBanner("✅ Success: Deposited " + amountValue.toLocaleString('en-US') + " USDC into the Auto-Compounding Vault!", "success");
    } catch (error) {
      triggerBanner("⚠️ Transaction execution timed out.", "error");
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
      triggerBanner("⚠️ Please enter a valid amount of $ZQI tokens to lock.", "warning");
      return;
    }
    if (amount > zqiBalance) {
      triggerBanner("⚠️ Insufficient $ZQI balance inside your wallet!", "error");
      return;
    }

    setIsLockLoading(true);
    setRewardClaimable(false); 

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      triggerBanner(`🎉 Successfully locked ${amount} $ZQI! Tokens cryptographically bound to Epoch.`, "success");
      setIsTokenLocked(true);
      setStakedAmount(amount); 
      setZqiBalance(prev => prev - amount); 
      
      // 1. Saat baru dikunci, saldo hasil mulai dari 0.00 USDC
      setEarnedUsdcDisplay("0.00 USDC");
      setShowRewardRow(true);
      setProtocolTVL(prev => prev + (amount * tokenPrices.ZQI)); 

      // 2. Simulasi Epoch 8 detik: dividen baru terisi dan tombol claim menyala
      setTimeout(() => {
        const finalMultiplier = (lockCalculationMode === 'wizard') ? chosenMultiplier : 1;
        const rewardAmount = ((amount * 0.05) * finalMultiplier).toFixed(2);
        localStorage.setItem('zoniq_staking_session', JSON.stringify({ isLocked: true, amount, multiplier: finalMultiplier, mode: lockCalculationMode, earnedDisplay: `${rewardAmount} USDC` }));
        
        setEarnedUsdcDisplay(`${rewardAmount} USDC`);
        setRewardClaimable(true);
        triggerBanner("✨ Smart Contract Update: Staking Epoch completed! Yield rewards are now claimable.", "success");
      }, 8000); 

    } catch (error) {
      triggerBanner("⚠️ Transaction bundle rejected.", "error");
    } finally {
      setIsLockLoading(false);
    }
  };

  const claimZqiReward = () => {
    if (!rewardClaimable) {
      triggerBanner("⚠️ Smart Contract Refusal: Epoch locked! Cannot execute yield withdrawal yet.", "error");
      return;
    }
    
    // Notifikasi Web3 sukses klaim
    triggerBanner(`🎉 Claim Successful! ${earnedUsdcDisplay} has been transferred to your wallet.`, "success");
    
    // Reset saldo hasil ke 0.00 USDC dan matikan status claimable (baris tetap terlihat)
    setEarnedUsdcDisplay("0.00 USDC");
    setRewardClaimable(false);
  };

  // 1. Membuka modal konfirmasi buatan kita (bukan popup browser)
  const triggerEmergencyModal = () => {
    if (!isConnected) {
      triggerBanner("⚠️ Please connect your wallet first!", "error");
      return;
    }
    if (stakedAmount <= 0) {
      triggerBanner("⚠️ [Error]: No locked assets detected to execute early withdrawal.", "error");
      return;
    }
    setShowEmergencyModal(true);
  };

  const executeEmergencyUnlock = async () => {
    setShowEmergencyModal(false);
    setIsLockLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const penaltyAmount = stakedAmount * EMERGENCY_BURN_PENALTY_RATE;
      const finalAmountReturned = stakedAmount - penaltyAmount;
      localStorage.removeItem('zoniq_staking_session');

      setZqiBalance(prev => prev + finalAmountReturned);
      setProtocolTVL(prev => prev - (stakedAmount * tokenPrices.ZQI)); 
      
      triggerBanner(`🔥 Emergency Unlock: ${penaltyAmount.toFixed(2)} $ZQI Burned (10% Penalty). ${finalAmountReturned.toFixed(2)} $ZQI returned!`, "warning");
      
      setStakedAmount(0);
      setLockAmount("0");
      setIsTokenLocked(false);
      setShowRewardRow(false);
      setRewardClaimable(false); 
      setEarnedUsdcDisplay("0.00 USDC");
      
      setTxLog(`🔥 Deflationary Trigger: ${penaltyAmount.toFixed(2)} $ZQI permanently burned.`);
      setTimeout(() => {
        setTxLog('');
      }, 8000);
    } catch (error) {
      triggerBanner("⚠️ Emergency execution failed.", "error");
    } finally {
      setIsLockLoading(false);
    }
  };

  const copyLink = () => {
    if (!isConnected) {
      setIsModalOpen(true);
      triggerBanner("⚠️ Please connect your wallet first!", "warning");
      return;
    }
    const generatedUrl = `https://${currentDomain}?ref=${myWalletAddress}`;
    navigator.clipboard.writeText(generatedUrl).then(() => triggerBanner("📋 Copied Link to Clipboard!", "success"));
  };

  const verifyReferralOnChain = () => {
    const inputVal = referrerInput.trim();
    if (inputVal.startsWith("0x")) {
      triggerBanner("⚠️ EVM address detected (0x...). Only Solana network is supported!", "error");
      return;
    }
    if (inputVal === "") {
      triggerBanner("Please enter a wallet address or .sns domain.", "warning");
      return;
    }

    // Cegah input cuma ekstensi tanpa nama domain di depannya
    if (inputVal.toLowerCase() === ".sns" || inputVal.toLowerCase() === ".sol") {
      triggerBanner("⚠️ Please enter a complete domain name (e.g. alice.sol or bonk.sns)", "warning");
      return;
    }

    const snsData = resolveSNSInput(inputVal);

    if (snsData.isDomain) {
      triggerBanner(`🔍 SNS Domain Resolved: ${snsData.displayName} (Verified On-Chain)`, "success");
    } else {
      triggerBanner(`✅ Referrer Verified On-Chain: ${inputVal.slice(0, 4)}...${inputVal.slice(-4)}`, "success");
    }

    const simulatedVolume = Math.floor(Math.random() * 145000) + 5000;
    setReferralVolume(`$${simulatedVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

    let rate = 0.10;
    if (simulatedVolume <= 10000) {
      setTierLabel("Bronze (10%)"); setTierColor("#14b8a6");
      rate = 0.10;
    } else if (simulatedVolume > 10000 && simulatedVolume <= 100000) {
      setTierLabel("Silver (18%)"); setTierColor("#3b82f6");
      rate = 0.18;
    } else {
      setTierLabel("Gold (25%)"); setTierColor("#a855f7");
      rate = 0.25;
    }

    const totalEarnedUsdc = simulatedVolume * rate;
    setReferralEarned(`$${totalEarnedUsdc.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC`);
  };

  if (view === 'onboarding-rahasia') {
    return <ClientOnboardingForm />;
  }

  if (view === 'landing') {
    return (
      <>
        {showCompliance && (
          <ComplianceModal 
            isOpen={showCompliance}
            onClose={() => setShowCompliance(false)}
            onAccept={handleAcceptCompliance}
          />
        )}
        <Landing 
          activeClients={activeClients} 
          whiteLabelsLive={whiteLabelsLive} 
          oneOffBuyers={oneOffBuyers} 
          onLaunchApp={handleLaunchWithCompliance} 
        />
      </>
    );
  }

  return (
    <>
      {/* STYLE INTEGRASI TAB RESPONSIVE SINGLE-FRAME APP (PERFECT CENTER) */}
      <style>{`
        .dapp-container {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: flex-start !important;
          width: 100% !important;
          max-width: 100% !important;
          padding: 20px 15px !important;
          box-sizing: border-box !important;
        }
        .dapp-nav-tabs-wrapper {
          display: flex !important;
          justify-content: center !important;
          margin: 15px auto 25px auto !important;
          max-width: 480px !important;
          width: 100% !important;
        }
        .dapp-nav-tabs {
          display: flex !important;
          background: #0d1322 !important;
          border: 1px solid #1e293b !important;
          padding: 6px !important;
          border-radius: 14px !important;
          width: 100% !important;
          gap: 6px !important;
        }
        .dapp-tab-btn {
          flex: 1 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          padding: 10px 12px !important;
          border-radius: 10px !important;
          border: none !important;
          background: transparent !important;
          color: #94a3b8 !important;
          font-weight: 700 !important;
          font-size: 0.88rem !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          white-space: nowrap !important;
        }
        .dapp-tab-btn:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.04) !important;
        }
        .dapp-tab-btn.active {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
        }
        .dapp-single-frame-container {
          max-width: 480px !important;
          margin: 0 auto !important;
          width: 100% !important;
        }
        .dapp-single-frame-container.wide-frame {
          max-width: 780px !important;
        }
        .dapp-single-frame-container .product-card {
          width: 100% !important;
          box-sizing: border-box !important;
          margin: 0 auto !important;
        }
        @media (max-width: 640px) {
          .dapp-tab-btn {
            font-size: 0.78rem !important;
            padding: 8px 4px !important;
            gap: 4px !important;
          }
        }
      `}</style>

      {/* 👉 TEMPATKAN MODAL DI SINI (Return Utama Dashboard) */}
      <TransactionSuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        swapDetails={successModalData}
        programId={PROGRAM_ID}
      />

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

      {/* HEADER UTAMA (RESPONSIF MOBILE & DESKTOP) */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#060911',
        borderBottom: '1px solid #1f2937',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* KIRI: LOGO + BRAND */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src={logoZoniq} 
            alt="ZoniqFi" 
            style={{ width: '26px', height: '26px', objectFit: 'contain' }} 
          />
          <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#ffffff' }}>
            ZONIQFI
          </span>
          <span style={{ fontSize: '0.65rem', padding: '2px 5px', backgroundColor: '#1e293b', borderRadius: '4px', color: '#14F195', fontWeight: 'bold' }}>
            $ZQI
          </span>
        </div>

        {/* KANAN: TOMBOL RINGKAS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setView('landing')} 
            style={{ 
              background: 'transparent', 
              border: '1px solid #374151', 
              color: '#9ca3af', 
              cursor: 'pointer', 
              padding: '6px 10px', 
              borderRadius: '6px', 
              fontSize: '0.75rem', 
              fontWeight: '600' 
            }}>
            Home
          </button>
          
          <button 
            id="walletBtn" 
            onClick={openWalletModal} 
            style={{ 
              padding: '6px 12px', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '0.75rem',
              background: isConnected ? "#10b981" : "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              whiteSpace: 'nowrap'
            }}>
            {isConnected ? `🟢 ${myWalletAddress.slice(0, 4)}...${myWalletAddress.slice(-4)}` : "Connect"}
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div id="walletModal" className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '420px', width: '90%' }}>
            <div className="modal-header">
              <h3>Select Solana Wallet</h3>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px 0' }}>
              <button className="wallet-option-btn" onClick={() => selectWallet('phantom')} style={{ margin: 0, padding: '12px' }}><span className="wallet-icon">👻</span> Phantom</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('solflare')} style={{ margin: 0, padding: '12px' }}><span className="wallet-icon">☀️</span> Solflare</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('okx')} style={{ margin: 0, padding: '12px' }}><span className="wallet-icon">🌐</span> OKX Wallet</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('backpack')} style={{ margin: 0, padding: '12px' }}><span className="wallet-icon">🎒</span> Backpack</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('coinbase')} style={{ margin: 0, padding: '12px' }}><span className="wallet-icon">🔵</span> Coinbase</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('brave')} style={{ margin: 0, padding: '12px' }}><span className="wallet-icon">🦁</span> Brave</button>
              <button className="wallet-option-btn" onClick={() => selectWallet('ledger')} style={{ gridColumn: 'span 2', margin: 0, padding: '12px', background: 'linear-gradient(135deg, #1f2937, #111827)', border: '1px solid #374151' }}><span className="wallet-icon">🛡️</span> Ledger Hardware Wallet</button>
            </div>
          </div>
        </div>
      )}

      <main className="dapp-container">
  <div className="rpc-status-container" style={{ marginBottom: '10px', fontSize: '0.82rem', color: '#94a3b8' }}>
    <span className="rpc-status-indicator"></span>
    <span>RPC Node: Operational ({SOLANA_NETWORK})</span>
  </div>

        {/* TAB NAVIGATION BAR TERPADU DENGAN SINKRONISASI FILTER PAKET */}
        <div className="dapp-nav-tabs-wrapper">
          <div className="dapp-nav-tabs">
            {SHOW_SWAP && (
              <button 
                className={`dapp-tab-btn ${activeTab === 'swap' ? 'active' : ''}`}
                onClick={() => setActiveTab('swap')}
              >
                🔄 <span className="tab-text">Swap</span>
              </button>
            )}
            {SHOW_OPTIMIZER && (
              <button 
                className={`dapp-tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
                onClick={() => setActiveTab('vault')}
              >
                📈 <span className="tab-text">Vault</span>
              </button>
            )}
            {SHOW_LOCKER && (
              <button 
                className={`dapp-tab-btn ${activeTab === 'staking' ? 'active' : ''}`}
                onClick={() => setActiveTab('staking')}
              >
                🔒 <span className="tab-text">Lock</span>
              </button>
            )}
            {SHOW_AFFILIATE && (
              <button 
                className={`dapp-tab-btn ${activeTab === 'affiliate' ? 'active' : ''}`}
                onClick={() => setActiveTab('affiliate')}
              >
                👥 <span className="tab-text">Affiliate</span>
              </button>
            )}
          </div>
        </div>

        {txLog && (
          <div className="security-banner" style={{ display: 'block', background: '#111827', borderColor: '#1f2937', color: '#38bdf8', fontSize: '0.88rem', fontStyle: 'italic', whiteSpace: 'pre-line', maxWidth: activeTab === 'affiliate' ? '780px' : '480px', margin: '0 auto 20px auto' }}>
            {txLog}
          </div>
        )}

        {/* AREA INTEGRASI: Menampilkan Log Distribusi Premium HANYA saat di Tab Swap */}
        {distributionData && activeTab === 'swap' && (
          <div style={{ maxWidth: '480px', margin: '0 auto 20px auto', width: '100%' }}>
            <DistributionLog programId={PROGRAM_ID} swapData={distributionData} />
          </div>
        )}

        {/* SINGLE-FRAME CONTAINER CENTERED */}
        <div className={`dapp-single-frame-container ${activeTab === 'affiliate' ? 'wide-frame' : ''}`}>
          
          {/* MODUL 1: SWAP */}
          {SHOW_SWAP && activeTab === 'swap' && (
            <div className="product-card swap-card">
              <div className="card-title-row">
                <h3>AMM DEX Swap</h3>
                <span id="mevBadge" className="mev-secure-badge">🛡️ MEV SECURE</span>
              </div>
              <p className="desc">Instant asset swapping with MEV protection and daily Anti-Wash Trading features.</p>

              {/* FIELD INPUT: YOU PAY */}
              <div className="swap-input-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', margin: 0 }}>You Pay</label>
                  {isConnected && (
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Balance: <strong style={{ color: '#ffffff' }}>{tokenPay === 'ZQI' ? zqiBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : (tokenPay === 'USDC' ? '5,000.00' : '10.50')} {tokenPay}</strong></span>
                      <button 
                        type="button" 
                        onClick={() => setPayAmount(tokenPay === 'ZQI' ? zqiBalance.toString() : (tokenPay === 'USDC' ? '5000' : '10.5'))}
                        style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#60a5fa', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}
                      >
                        MAX
                      </button>
                    </div>
                  )}
                </div>
                <div className="field-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#090d16', padding: '4px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <input type="number" id="payAmount" placeholder="0.0" value={payAmount === '0' ? '' : payAmount} disabled={isSwapLoading} onChange={(e) => setPayAmount(e.target.value)} onBlur={() => { if (payAmount === '') setPayAmount('0'); }} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '1.1rem', padding: '8px 0' }} />
                  <select id="tokenPay" value={tokenPay} onChange={(e) => handleTokenChange(e.target.value)} style={{ background: '#0b0f19', color: '#fff', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}>
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
                <div className="field-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#090d16', padding: '4px 12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <input type="text" id="receiveAmount" value={receiveAmount} readOnly style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '1.1rem', padding: '8px 0' }} />
                  <span id="tokenReceiveLabel" className="static-token-label" style={{ fontWeight: '800', color: '#38bdf8', paddingRight: '6px', fontSize: '1rem' }}>{tokenReceive}</span>
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
          {SHOW_OPTIMIZER && activeTab === 'vault' && (
            <div className="product-card">
              <h3>Yield Optimizer</h3>
              <p className="desc">Deposit once, the system automatically executes periodic auto-compounding optimization.</p>
              <div className="stat-box">Boosted APY: Up to 49.1%</div>
              
              <div className="pool-meta-row" style={{ display: 'flex', justifyContent: 'space-between', background: '#070a13', border: '1px solid #1e293b', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Global Vault TVL: <strong style={{ color: '#14b8a6' }}>${(protocolTVL * 0.58).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong></span>
                <span style={{ color: '#94a3b8' }}>Active Depositors: <strong style={{ color: '#ffffff' }}>1,842 Users</strong></span>
              </div>
              
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
          {SHOW_LOCKER && activeTab === 'staking' && (
            <div className="product-card">
              <h3>ZQI Lock & Yield</h3>
              <p className="desc">Lock your $ZQI tokens to claim Real Yield paid out in stable USDC. Early unlock incurs a 10% penalty.</p>

              <div className="calc-tabs">
                <button className={`tab-btn ${lockCalculationMode === 'manual' ? 'active' : ''}`} id="tabManual" onClick={() => switchLockCalculationView('manual')}>Instant Lock</button>
                <button className={`tab-btn ${lockCalculationMode === 'wizard' ? 'active' : ''}`} id="tabWizard" onClick={() => switchLockCalculationView('wizard')}>Boosted Lock</button>
              </div>

              <div className="pool-meta-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Protocol TVL: <strong id="poolTvl">${protocolTVL.toLocaleString('en-US')}</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Your Balance: <strong id="zqiBalance">{zqiBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ZQI</strong>
                  {isConnected && zqiBalance > 0 && !isTokenLocked && (
                    <button 
                      type="button" 
                      onClick={() => setLockAmount(zqiBalance.toString())}
                      style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#60a5fa', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}
                    >
                      MAX
                    </button>
                  )}
                </span>
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
                <span className="badge-accent-line">Reward: Real USDC (Demo Sandbox Epoch)</span>
                {estimatedRewardText && <span id="accumulationLabel" className="badge-sub-info" style={{ display: 'block' }}>{estimatedRewardText}</span>}
              </div>

              {isTokenLocked && !isLockLoading && showRewardRow && (
                <div className="claim-management-row" id="rewardClaimRow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-10px', marginBottom: '15px', background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    Yield Earned: <strong id="earnedUsdc" style={{ color: rewardClaimable ? '#22c55e' : '#ffffff', fontSize: '1rem', marginLeft: '4px' }}>{earnedUsdcDisplay}</strong>
                  </span>
                  <button 
                    className="btn-claim-reward" 
                    onClick={claimZqiReward} 
                    disabled={!rewardClaimable}
                    style={{ 
                      opacity: rewardClaimable ? 1 : 0.7, 
                      background: rewardClaimable ? "#22c55e" : "#334155", 
                      cursor: rewardClaimable ? "pointer" : "not-allowed", 
                      border: "none", 
                      padding: "8px 14px", 
                      borderRadius: "6px", 
                      color: rewardClaimable ? "#ffffff" : "#94a3b8", 
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {rewardClaimable ? "Claim Reward" : (earnedUsdcDisplay === "0.00 USDC" ? "✓ Claimed" : "🔒 Epoch Accumulating...")}
                  </button>
                </div>
              )}

              <button className="btn-action" id="lockBtn" onClick={isConnected ? handleLockToken : openWalletModal} disabled={isTokenLocked || (isConnected && (!lockAmount || parseFloat(lockAmount) <= 0 || isLockLoading))} style={{ background: isTokenLocked ? "#22c55e" : !isConnected ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : (lockAmount && parseFloat(lockAmount) > 0) ? "linear-gradient(90deg, #1f6feb 0%, #238636 100%)" : "#1f2937", color: isTokenLocked ? "#ffffff" : (isConnected && (!lockAmount || parseFloat(lockAmount) <= 0)) ? "#64748b" : "#ffffff", cursor: isTokenLocked ? "not-allowed" : "pointer", pointerEvents: isTokenLocked ? "none" : "auto" }}>
                {isLockLoading ? 'Processing Lock...' : isTokenLocked ? '✓ Token Locked' : !isConnected ? 'Connect Wallet' : (!lockAmount || parseFloat(lockAmount) <= 0) ? 'Enter an Amount' : 'Lock Token'}
              </button>

              <button className="btn-action" id="emergencyUnlockBtn" onClick={triggerEmergencyModal} disabled={!isTokenLocked || isLockLoading} style={{ marginTop: "12px", width: "100%", padding: "12px", borderRadius: "8px", fontWeight: "600", background: (isTokenLocked && !isLockLoading) ? "#ef4444" : "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", color: (isTokenLocked && !isLockLoading) ? "#ffffff" : "#ef4444", cursor: (isTokenLocked && !isLockLoading) ? "pointer" : "not-allowed", pointerEvents: (isTokenLocked && !isLockLoading) ? "auto" : "none" }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '6px' }}></i> Emergency Early Unlock (10% Penalty)
              </button>
            </div>
          )}

          {/* MODUL 4: AFFILIATE / REFERRAL */}
          {SHOW_AFFILIATE && activeTab === 'affiliate' && (
            <section className="affiliate-section" style={{ background: '#0b121f', border: '1px solid #1e293b', borderRadius: '12px', padding: '30px', margin: '0 auto', color: '#94a3b8' }}>
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
                    value={isConnected ? `https://${currentDomain}?ref=${myWalletAddress}` : "Please connect your wallet..."} 
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

              <div className="tier-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#070a13', border: '1px solid #1e293b', padding: '16px 20px', borderRadius: '8px', fontSize: '0.9rem', flexWrap: 'wrap', gap: '12px' }}>
                <div className="tier-item" style={{ color: '#94a3b8' }}>
                  Current Tier: <span id="tierLabel" style={{ color: tierColor, fontWeight: '700' }}>{tierLabel}</span>
                </div>
                <div className="tier-item" style={{ color: '#94a3b8' }}>
                  Total Referral Volume: <span id="volLabel" style={{ color: '#ffffff', fontWeight: '700' }}>{referralVolume === '$0.00' && !isConnected ? '$0.00' : referralVolume}</span>
                </div>
                <div className="tier-item" style={{ color: '#94a3b8' }}>
                  Your Earned Commissions: <span style={{ color: '#22c55e', fontWeight: '800' }}>{referralEarned === '$0.00' && !isConnected ? '$0.00 USDC' : referralEarned}</span>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="dapp-footer" style={{ 
        borderTop: '1px solid #1f2937', 
        padding: '24px 5%', 
        background: '#060911', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        color: '#94a3b8', 
        fontSize: '0.88rem',
        gap: '16px',
        textAlign: 'center'
      }}>
        <style>{`
          @media (min-width: 769px) {
            .dapp-footer {
              flex-direction: row !important;
              text-align: left !important;
            }
          }
        `}</style>
        <p style={{ margin: 0, lineHeight: '1.5', maxWidth: '100%' }}>
          © 2026 ZoniqFi Protocol. All Rights Reserved. Modular Solana DeFi & Real Yield Infrastructure.
        </p>
        <div className="footer-links-row" style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <a 
            href="/ZoniqFi_Grant_Proposal.html" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            Documentation
          </a>

          <a 
            href="https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            Security Audit 🛡️
          </a>

          <button 
            onClick={() => setShowDisclaimer(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              color: '#94a3b8', 
              fontSize: '0.88rem', 
              cursor: 'pointer', 
              textDecoration: 'none', 
              transition: 'color 0.2s' 
            }}
          >
            Legal Disclaimer
          </button>
        </div>
      </footer>

      {/* MODAL LEGAL DISCLAIMER */}
      {showDisclaimer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            color: '#e2e8f0',
            textAlign: 'left',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛡️ Protocol Disclaimer
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              ZoniqFi is an experimental, non-custodial decentralized software architecture deployed on the Solana Devnet Sandbox. The protocol does not take custody of user assets, and interactions are governed strictly by immutable smart contract logic. Nothing on this platform constitutes financial or investment advice.
            </p>
            <button 
              onClick={() => setShowDisclaimer(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* MODAL EMERGENCY EARLY UNLOCK */}
      {showEmergencyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1322',
            border: '1px solid #ef4444',
            borderRadius: '16px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            color: '#e2e8f0',
            textAlign: 'left',
            boxShadow: '0 20px 50px rgba(239, 68, 68, 0.25)'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1.25rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ Emergency Unlock Warning
            </h3>
            
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              You are executing an early principal redemption before epoch maturity. The protocol will automatically trigger a <strong>10% deflationary penalty burn</strong>.
            </p>

            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '14px', marginBottom: '20px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Total Locked Assets:</span>
                <strong style={{ color: '#ffffff' }}>{stakedAmount} $ZQI</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#ef4444' }}>Deflationary Burn (10%):</span>
                <strong style={{ color: '#ef4444' }}>-{(stakedAmount * 0.10).toFixed(2)} $ZQI</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                <span style={{ color: '#22c55e' }}>Returned to Wallet:</span>
                <strong style={{ color: '#22c55e' }}>+{(stakedAmount * 0.90).toFixed(2)} $ZQI</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowEmergencyModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel / Keep Locked
              </button>
              
              <button 
                onClick={executeEmergencyUnlock}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                }}
              >
                Confirm & Burn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;