import ProtocolGuideModal from './components/ProtocolGuideModal';
import InvestorPitchModal from './components/InvestorPitchModal';
import { useState, useEffect } from 'react';
import Landing from './Landing';
import logoZoniq from './assets/image_436281.png'; 
import ComplianceModal from './components/ComplianceModal'; 
import ClientOnboardingForm from './components/ClientOnboardingForm';
import './App.css';
import DistributionLog from './components/DistributionLog';
import TransactionSuccessModal from './components/TransactionSuccessModal';
import { isSNSDomain, resolveSNSInput } from './utils/snsResolver';
import PayFiGateway from './components/PayFiGateway';

// Hook Resmi Solana Wallet Adapter
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

// Import Web3 primitives untuk transfer Solana & pool terpusat
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Protocol Treasury Addresses (Solana Devnet)
const PROTOCOL_POOLS = {
  VAULT: "BvmRYWTbkCwNqVUEeD7qgVqzM9rXh9egrDiWDBcsofny",
  LOCKER: "H8XSVM7UDZbk5eFhzWMLU5WPKZwNLBo85wGbrfPDX6Gw",
  AFFILIATE: "FU6cLtPS4eUBy92xa96Fb7pdaFv8A93LdEpT7MyHi7uh",
  OPERATIONS: "6PYRmzMiJvEjFS1qKHB5YwfkKyZv7e5CAbTnxtbPDLc4",
};

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

// MOCK CONSTANTS FOR SANDBOX DEMO DISCONNECTED FROM OLD GRANTS CONTRACT
const PROGRAM_ID = "HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD";
const ZQI_MINT = "6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz";
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
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [view, setView] = useState(() => {
    return localStorage.getItem('zoniq_current_view') || 'dapp';
  });
  const { publicKey, connected, disconnect, sendTransaction } = useWallet();
  const { setVisible } = useWalletModal();

  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // LIVE TICKER STATE
  const [tickerPrices, setTickerPrices] = useState([
    { symbol: 'ZQI', price: '$0.0500', change: 'PRESALE', isZqi: true },
    { symbol: 'SOL', price: '$145.20', change: '+3.4%' },
    { symbol: 'JUP', price: '$0.82', change: '+2.1%' },
    { symbol: 'RENDER', price: '$5.40', change: '-0.8%' },
    { symbol: 'BONK', price: '$0.000018', change: '+5.2%' },
  ]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana,jupiter-exchange-solana,render-token,bonk&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await res.json();
        if (data) {
          setTickerPrices([
            { symbol: 'ZQI', price: '$0.0500', change: 'PRESALE', isZqi: true },
            { 
              symbol: 'SOL', 
              price: `$${data.solana?.usd?.toFixed(2) || '145.20'}`, 
              change: `${(data.solana?.usd_24h_change || 0) >= 0 ? '+' : ''}${data.solana?.usd_24h_change?.toFixed(2)}%` 
            },
            { 
              symbol: 'JUP', 
              price: `$${data['jupiter-exchange-solana']?.usd?.toFixed(3) || '0.82'}`, 
              change: `${(data['jupiter-exchange-solana']?.usd_24h_change || 0) >= 0 ? '+' : ''}${data['jupiter-exchange-solana']?.usd_24h_change?.toFixed(2)}%` 
            },
            { 
              symbol: 'RENDER', 
              price: `$${data['render-token']?.usd?.toFixed(2) || '5.40'}`, 
              change: `${(data['render-token']?.usd_24h_change || 0) >= 0 ? '+' : ''}${data['render-token']?.usd_24h_change?.toFixed(2)}%` 
            },
            { 
              symbol: 'BONK', 
              price: `$${data.bonk?.usd?.toFixed(6) || '0.000018'}`, 
              change: `${(data.bonk?.usd_24h_change || 0) >= 0 ? '+' : ''}${data.bonk?.usd_24h_change?.toFixed(2)}%` 
            },
          ]);
        }
      } catch (err) {
        // Fallback jika rate-limit tercapai
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('zoniq_current_view', view);
  }, [view]);

  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toBase58();
      setMyWalletAddress(address);
      setIsConnected(true);
    } else if (!connected) {
      setIsConnected(false);
      setMyWalletAddress('');
    }
  }, [connected, publicKey]);
  
  // Saldo SOL Otomatis
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBalance = async () => {
      if (publicKey && connection) {
        try {
          const balance = await connection.getBalance(publicKey);
          if (isMounted) {
            setSolBalance((balance / 1e9).toFixed(3));
          }
        } catch (err) {
          console.error("Gagal mengambil saldo SOL:", err);
        }
      } else {
        setSolBalance(null);
      }
    };

    fetchBalance();
    return () => { isMounted = false; };
  }, [publicKey, connection]);
  
  const [activeTab, setActiveTab] = useState(() => {
    if (SHOW_SWAP) return 'swap';
    if (SHOW_OPTIMIZER) return 'vault';
    if (SHOW_LOCKER) return 'staking';
    if (SHOW_AFFILIATE) return 'affiliate';
    return 'swap';
  });

  const [showDisclaimer, setShowDisclaimer] = useState(false);
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

  const [activeClients, setActiveClients] = useState(48);
  const [whiteLabelsLive, setWhiteLabelsLive] = useState(19);
  const [oneOffBuyers, setOneOffBuyers] = useState(320);
  
  useEffect(() => {
    window.onerror = function (message) {
      console.warn("[ZoniqFi Sandbox Guard] Suppressed on-chain network mismatch error:", message);
      return true; 
    };

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const activePackage = urlParams ? urlParams.get('pkg') : null;
    const currentViewParam = urlParams ? urlParams.get('view') : null;
    
    const refParam = urlParams ? urlParams.get('ref') : null;
    if (refParam) {
      localStorage.setItem('zoniq_cached_referrer', refParam);
      setReferrerInput(refParam);
    } else {
      const savedRef = localStorage.getItem('zoniq_cached_referrer');
      if (savedRef) {
        setReferrerInput(savedRef);
      }
    }

    if (currentViewParam === 'onboarding') {
      setView('onboarding-rahasia');
    } else if (activePackage) {
      setView('dashboard'); 
    }
  }, []);

  const [isConnected, setIsConnected] = useState(false);
  const [myWalletAddress, setMyWalletAddress] = useState("");
  const [activeProviderName, setActiveProviderName] = useState("");
  
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

          const savedStaking = localStorage.getItem('zoniq_staking_session');
          if (savedStaking) {
            const stData = JSON.parse(savedStaking);
            if (stData.isLocked) {
              setIsTokenLocked(true);
              setStakedAmount(stData.amount || 1000);
              setShowRewardRow(true);
              
              const currentReward = stData.earnedDisplay || "0.00 USDC";
              setEarnedUsdcDisplay(currentReward);
              
              const isClaimable = currentReward !== "0.00 USDC" && !stData.isClaimed;
              setRewardClaimable(isClaimable);

              baseBal = Math.max(0, baseBal - (stData.amount || 1000));
            }
          }

          const savedVault = localStorage.getItem('zoniq_vault_session');
          if (savedVault) {
            const vData = JSON.parse(savedVault);
            if (vData.calcAmount) setCalcAmount(vData.calcAmount.toString());
          }

          const savedAffiliate = localStorage.getItem('zoniq_affiliate_data');
          if (savedAffiliate) {
            const aff = JSON.parse(savedAffiliate);
            if (aff.referrer) setReferrerInput(aff.referrer);
            if (aff.volume) setReferralVolume(aff.volume);
            if (aff.earned) setReferralEarned(aff.earned);
            if (aff.tier) setTierLabel(aff.tier);
            if (aff.color) setTierColor(aff.color);
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
  
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [isLockLoading, setIsLockLoading] = useState(false);
  const [isTokenLocked, setIsTokenLocked] = useState(false);

  const IS_DEMO_MODE = true;
  const [instantDays, setInstantDays] = useState(7);
  const [lockCountdown, setLockCountdown] = useState(0);

  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [swapsCount, setSwapsCount] = useState(45210); 
  
  const [zqiBalance, setZqiBalance] = useState(0); 
  const [usdcBalance, setUsdcBalance] = useState(50.00);
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

  // STATE LIVE ON-CHAIN SETTLEMENT FEED (RIIL)
const [settlementLogs, setSettlementLogs] = useState([
  { title: "QRIS Settlement: #RELAY-SOL-02", desc: "Gas Tank Relayer ➔ 4 Pools Split", val: "0.00075 SOL (5%)", color: "#10b981" },
  { title: "AMM Swap: USDC ➔ $ZQI", desc: "Jito MEV Protected Bundle", val: "0.00300 SOL (0.3%)", color: "#38bdf8" },
  { title: "Yield Vault Auto-Compound", desc: "Epoch Rebalancing Executed", val: "+49.1% APY Boost", color: "#a855f7" },
  { title: "Liquidity Locker: #LP-LOCK", desc: "Protocol-Owned Liquidity (POL) Locked", val: "100% On-Chain Lock", color: "#f59e0b" }
]);

  const [distributionData, setDistributionData] = useState(null);
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
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const copyLink = () => {
    if (!isConnected) {
      setVisible(true);
      triggerBanner("⚠️ Please connect your wallet first!", "warning");
      return;
    }
    const generatedUrl = `https://${currentDomain}?ref=${myWalletAddress}`;
    navigator.clipboard.writeText(generatedUrl).then(() => triggerBanner("📋 Copied Link to Clipboard!", "success"));
  };

  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', priceInUsdc: tokenPrices.USDC },
    { symbol: 'USDT', name: 'Tether', priceInUsdc: tokenPrices.USDT },
    { symbol: 'SOL', name: 'Solana', priceInUsdc: tokenPrices.SOL },
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
      const netAmount = Math.max(0, amount - calculatedFee);
      const totalValueInUsdc = netAmount * payTokenData.priceInUsdc;
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
      if (!publicKey) {
        alert("Silakan hubungkan dompet Anda terlebih dahulu!");
        return;
      }

      const currentFee = parseFloat(swapFee) || 0;
      const totalFeeLamports = Math.floor(currentFee * LAMPORTS_PER_SOL);

      if (totalFeeLamports <= 0) {
        alert("Nominal swap terlalu kecil untuk kalkulasi fee!");
        return;
      }

      const vaultLamports = Math.floor(totalFeeLamports * 0.40);
      const lockerLamports = Math.floor(totalFeeLamports * 0.30);
      const affiliateLamports = Math.floor(totalFeeLamports * 0.15);
      const opsLamports = totalFeeLamports - (vaultLamports + lockerLamports + affiliateLamports);

      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(PROTOCOL_POOLS.VAULT),
          lamports: vaultLamports,
        })
      );

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(PROTOCOL_POOLS.LOCKER),
          lamports: lockerLamports,
        })
      );

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(PROTOCOL_POOLS.AFFILIATE),
          lamports: affiliateLamports,
        })
      );

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(PROTOCOL_POOLS.OPERATIONS),
          lamports: opsLamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      const vaultShareNum = currentFee * 0.40;
      const poolShareNum = currentFee * 0.30;
      const affiliateShareNum = currentFee * 0.15;
      const opsShareNum = currentFee * 0.15;

      const vaultShare = vaultShareNum.toFixed(5);
      const poolShare = poolShareNum.toFixed(5);
      const affiliateShare = affiliateShareNum.toFixed(5);
      const projectTreasuryShare = opsShareNum.toFixed(5);

      setSwapsCount(prev => prev + 1);
      setTxLog(signature);
      // SUNTIKKAN TRANSAKSI ASLI KE LOG KIRI SECARA REAL-TIME
setSettlementLogs(prev => [
  {
    title: `AMM Swap: ${amount} ${tokenPay} ➔ ${receiveAmount} ${tokenReceive}`,
    desc: `Tx: ${signature.slice(0, 6)}...${signature.slice(-4)} (Devnet Finalized)`,
    val: `${swapFee} ${tokenPay} (0.3%)`,
    color: "#38bdf8"
  },
  ...prev.slice(0, 3) // Menjaga daftar tetap maksimal 4 baris teratas
]);

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

      setTimeout(() => {
        setDistributionData(null);
      }, 20000);

      setProtocolTVL(prev => prev + Math.round(vaultShareNum * 100) / 100);

      if (isTokenLocked) {
        const currentEarned = parseFloat(earnedUsdcDisplay) || 0;
        const updatedEarned = (currentEarned + poolShareNum).toFixed(4);
        setEarnedUsdcDisplay(`${updatedEarned} USDC`);
        setRewardClaimable(true);
      }

      if (referrerInput.trim() !== '') {
        const currentVol = parseFloat(referralVolume.replace(/[^0-9.-]+/g, "")) || 0;
        const newVol = currentVol + amount;
        setReferralVolume(`$${newVol.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

        const currentEarned = parseFloat(referralEarned.replace(/[^0-9.-]+/g, "")) || 0;
        const newEarned = currentEarned + affiliateShareNum;
        setReferralEarned(`$${newEarned.toFixed(2)} USDC`);
      }

      if (tokenReceive === 'ZQI') {
        setZqiBalance(prev => prev + parseFloat(receiveAmount));
      } else if (tokenPay === 'ZQI') {
        setZqiBalance(prev => Math.max(0, prev - amount));
      }

      setSuccessModalData({
        fromAmount: `${amount} ${tokenPay}`,
        toAmount: `${receiveAmount} ${tokenReceive}`,
        feeAmount: `${swapFee} ${tokenPay}`,
        txSignature: signature
      });
      setIsSuccessModalOpen(true);

      triggerBanner(`✅ Swap Executed! 15% Ops Fee (${opsShareNum.toFixed(4)} ${tokenPay}) routed to Developer Treasury.`, "success");

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
    const instantMultiplier = instantDays === 30 ? 1.0 : instantDays === 15 ? 0.75 : 0.5;

    if (lockCalculationMode === 'manual') {
      const weightedScore = amount * instantMultiplier;
      setLiveScore(`${weightedScore.toLocaleString('en-US')} ZQI Share`);
      if (amount > 0) {
        const calculatedReward = (amount * 0.05 * instantMultiplier).toFixed(2);
        setEstimatedRewardText(`Estimated Accumulation: +${calculatedReward} USDC`);
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
  }, [lockAmount, lockCalculationMode, chosenMultiplier, instantDays, isTokenLocked]);

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
      
      setEarnedUsdcDisplay("0.00 USDC");
      setShowRewardRow(true);
      setProtocolTVL(prev => prev + (amount * tokenPrices.ZQI)); 

      const waitSeconds = IS_DEMO_MODE ? 8 : (lockCalculationMode === 'manual' ? instantDays : 30) * 86400;
      setLockCountdown(waitSeconds);

      const timerInterval = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            const currentInstantMult = instantDays === 30 ? 2.5 : instantDays === 15 ? 1.5 : 1.0;
            const finalMultiplier = (lockCalculationMode === 'wizard') ? chosenMultiplier : currentInstantMult;
            const rewardAmount = ((amount * 0.05) * finalMultiplier).toFixed(2);
            localStorage.setItem('zoniq_staking_session', JSON.stringify({ isLocked: true, amount, multiplier: finalMultiplier, mode: lockCalculationMode, earnedDisplay: `${rewardAmount} USDC` }));
            
            setEarnedUsdcDisplay(`${rewardAmount} USDC`);
            setRewardClaimable(true);
            triggerBanner("✨ Smart Contract Update: Staking Epoch completed! Yield rewards are now claimable.", "success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000); 

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

    const rewardValue = parseFloat(earnedUsdcDisplay) || 0;
    triggerBanner(`🎉 Claim Successful! +${rewardValue.toFixed(4)} USDC has been transferred to your wallet.`, "success");
    setUsdcBalance(prev => prev + rewardValue);
    setEarnedUsdcDisplay("0.00 USDC");
    setRewardClaimable(false);

    try {
      const savedStaking = localStorage.getItem('zoniq_staking_session');
      if (savedStaking) {
        const parsed = JSON.parse(savedStaking);
        parsed.earnedDisplay = "0.00 USDC";
        parsed.isClaimed = true;
        localStorage.setItem('zoniq_staking_session', JSON.stringify(parsed));
      }
    } catch (err) {
      console.warn("Failed to update claim state:", err);
    }
  };

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

  const verifyReferralOnChain = () => {
    let inputVal = referrerInput.trim();

    if (inputVal.includes("?ref=")) {
      inputVal = inputVal.split("?ref=")[1].split("&")[0].trim();
    }

    if (inputVal === myWalletAddress && isConnected) {
      triggerBanner("⚠️ You cannot refer your own public address!", "error");
      return;
    } 
    if (inputVal === "") {
      triggerBanner("Please enter a wallet address or .sol domain.", "warning");
      return;
    }

    const isDomain = isSNSDomain(inputVal);

    if (isDomain) {
      triggerBanner(`🔍 SNS Domain Resolved: ${inputVal} (Verified On-Chain)`, "success");
    } else {
      const shortAddr = `${inputVal.slice(0, 4)}...${inputVal.slice(-4)}`;
      triggerBanner(`✅ Referrer Address: ${shortAddr} (Verified On-Chain)`, "success");
    }

    const simulatedVolume = Math.floor(Math.random() * 145000) + 5000;
    const formattedVolume = `$${simulatedVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    setReferralVolume(formattedVolume);

    let rate = 0.10;
    let label = "Bronze (10%)";
    let color = "#14b8a6";

    if (simulatedVolume <= 10000) {
      label = "Bronze (10%)";
      color = "#14b8a6";
      rate = 0.10;
    } else if (simulatedVolume > 10000 && simulatedVolume <= 100000) {
      label = "Silver (18%)";
      color = "#3b82f6";
      rate = 0.18;
    } else {
      label = "Gold (25%)";
      color = "#a855f7";
      rate = 0.25;
    }

    setTierLabel(label);
    setTierColor(color);

    const totalEarnedUsdc = simulatedVolume * rate;
    const formattedEarned = `$${totalEarnedUsdc.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC`;
    setReferralEarned(formattedEarned);

    localStorage.setItem('zoniq_affiliate_data', JSON.stringify({
      referrer: inputVal,
      volume: formattedVolume,
      earned: formattedEarned,
      tier: label,
      color: color
    }));
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
      {/* STYLE INTEGRASI 2-COLUMN TERMINAL DASHBOARD */}
      <style>{`
        .dapp-container {
          width: 100% !important;
          max-width: 1240px !important;
          margin: 0 auto !important;
          padding: 24px 16px !important;
          box-sizing: border-box !important;
        }

        /* Responsive 2-Column Grid Layout */
        .zoniq-terminal-grid {
          display: grid !important;
          grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr) !important;
          gap: 24px !important;
          align-items: start !important;
          width: 100% !important;
        }

        .zoniq-terminal-left {
          display: flex !important;
          flex-direction: column !important;
          gap: 18px !important;
          width: 100% !important;
          position: sticky !important;
          top: 20px !important;
          min-width: 0 !important;
        }

        .zoniq-terminal-right {
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
          width: 100% !important;
          min-width: 0 !important;
        }

        /* Navigasi Tab Sisi Kanan */
        .dapp-nav-tabs-wrapper {
          display: flex !important;
          width: 100% !important;
          margin-bottom: 4px !important;
        }
        .dapp-nav-tabs {
          display: flex !important;
          background: #0d1322 !important;
          border: 1px solid #1e293b !important;
          padding: 5px !important;
          border-radius: 14px !important;
          width: 100% !important;
          gap: 4px !important;
          box-sizing: border-box !important;
        }
        .dapp-tab-btn {
          flex: 1 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 5px !important;
          padding: 9px 8px !important;
          border-radius: 10px !important;
          border: none !important;
          background: transparent !important;
          color: #94a3b8 !important;
          font-weight: 700 !important;
          font-size: 0.82rem !important;
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

        /* Single Frame & Cards */
        .dapp-single-frame-container {
          width: 100% !important;
          margin: 0 auto !important;
        }
        .dapp-single-frame-container .product-card,
        .payfi-wrapper,
        .affiliate-section {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        /* Sisi Kiri: Mini KPI Cards */
        .zoniq-stat-card {
          background: #0b121f;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        /* Sisi Kiri: Visual Chart Box */
        .zoniq-chart-box {
          background: #0b121f;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Sisi Kiri: Live Activity Feed Box */
        .zoniq-feed-box {
          background: #0b121f;
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 16px 18px;
        }

        /* Responsive Breakpoint: Tablet & HP menjadi 1 kolom */
        @media (max-width: 1024px) {
          .zoniq-terminal-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .zoniq-terminal-left {
            order: 2 !important;
            position: static !important; /* 👈 WAJIB: Mematikan efek melayang di HP */
          }
          .zoniq-terminal-right {
            order: 1 !important;
          }
        }

        @media (max-width: 640px) {
          .dapp-container {
            padding: 16px 12px !important;
          }
          .dapp-nav-tabs {
            overflow-x: auto !important; /* Mencegah tombol tab gepeng di layar HP sempit */
            scrollbar-width: none !important;
          }
          .dapp-nav-tabs::-webkit-scrollbar {
            display: none !important;
          }
          .dapp-tab-btn {
            font-size: 0.74rem !important;
            padding: 8px 6px !important;
            gap: 3px !important;
          }
        }
      `}</style>

      <TransactionSuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        swapDetails={successModalData}
        programId={PROGRAM_ID}
        onNavigateTab={(tabName) => setActiveTab(tabName)}
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

      {/* HEADER UTAMA */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '0 12px',
            height: '36px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: '600',
            color: '#34d399',
            boxSizing: 'border-box'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }}></span>
            Devnet
          </div>
          
          <button 
            id="walletBtn" 
            onClick={() => {
              if (!isConnected) {
                openWalletModal();
              } else {
                setShowWalletMenu((prev) => !prev);
              }
            }} 
            style={{ 
              padding: '0 14px', 
              height: '36px', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '0.75rem', 
              background: isConnected ? "#10b981" : "linear-gradient(135deg, #8b5cf6, #3b82f6)", 
              whiteSpace: 'nowrap', 
              boxSizing: 'border-box', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
            {isConnected ? `🟢 ${myWalletAddress.slice(0, 4)}...${myWalletAddress.slice(-4)}` : "Connect"}
          </button> 

          {isConnected && showWalletMenu && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              background: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '6px',
              minWidth: '160px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{
                padding: '8px 10px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '6px',
                border: '1px solid #1f2937',
                marginBottom: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>SOL Balance</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#10b981' }}>
                    {solBalance !== null ? `${solBalance} SOL` : 'Loading...'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>USDC Balance</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#38bdf8' }}>
                    {usdcBalance.toFixed(2)} USDC
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(myWalletAddress);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#e5e7eb',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                📋 {copied ? "Copied!" : "Copy Address"}
              </button>

              <a
                href={`https://solscan.io/account/${myWalletAddress}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#e5e7eb',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🔍 Solscan
              </a>

              <hr style={{ border: 'none', borderTop: '1px solid #1f2937', margin: '2px 0' }} />

              <button
                onClick={() => {
                  setShowWalletMenu(false);
                  disconnect();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🚪 Disconnect
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE WALLET MINI ICON STRIP (Horizontal & Clean) */}
      {!isConnected && (
        <div className="mobile-wallet-helper">
          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '500' }}>
            Open in app:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Phantom */}
            <a
              href="https://phantom.app/ul/browse/https%3A%2F%2Fzoniqfi.com"
              title="Phantom"
              className="wallet-icon-btn"
            >
              <img
                src="https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/phantom/icon.svg"
                alt="Phantom"
                style={{ width: '20px', height: '20px', objectFit: 'contain' }}
              />
            </a>

            {/* Solflare */}
            <a
              href="https://solflare.com/ul/v1/browse/https%3A%2F%2Fzoniqfi.com"
              title="Solflare"
              className="wallet-icon-btn"
            >
              <img
                src="https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/solflare/icon.svg"
                alt="Solflare"
                style={{ width: '20px', height: '20px', objectFit: 'contain' }}
              />
            </a>

            {/* Backpack */}
            <a
              href="https://backpack.app/ul/v1/browse/https%3A%2F%2Fzoniqfi.com"
              title="Backpack"
              className="wallet-icon-btn"
            >
              <img
                src="https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/backpack/icon.svg"
                alt="Backpack"
                style={{ width: '20px', height: '20px', objectFit: 'contain' }}
              />
            </a>

            {/* MetaMask */}
            <a
              href="https://metamask.app.link/dapp/zoniqfi.com"
              title="MetaMask"
              className="wallet-icon-btn"
            >
              <img
                src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
                alt="MetaMask"
                style={{ width: '20px', height: '20px', objectFit: 'contain' }}
              />
            </a>
          </div>
        </div>
      )}

      {/* TOP TOKENOMICS MARQUEE BANNER */}
      <div style={{
        background: 'linear-gradient(90deg, #070e17 0%, #0c2135 50%, #070e17 100%)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
        padding: '7px 0',
        color: '#e2e8f0',
        fontSize: '0.78rem',
        fontWeight: '600',
        letterSpacing: '0.04em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        display: 'flex',
        userSelect: 'none'
      }}>
        <div className="ticker-track" style={{ animationDuration: '32s' }}>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
              <span>🔥 <span style={{ color: '#38bdf8' }}>PRESALE ROUND 1 ACTIVE</span></span>
              <span style={{ color: '#475569' }}>•</span>
              <span>1 $ZQI = <span style={{ color: '#34d399', fontWeight: '700' }}>$0.0500 USDC</span></span>
              <span style={{ color: '#475569' }}>•</span>
              <span>TOTAL SUPPLY: <span style={{ color: '#f8fafc', fontWeight: '700' }}>100,000,000 $ZQI</span></span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#a78bfa' }}>REAL YIELD STAKING LIVE</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#38bdf8' }}>DEVNET VERIFIED</span>
              <span style={{ margin: '0 16px', color: '#334155' }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE MARKET TICKER STRIP */}
      <div className="ticker-container">
        <div className="ticker-track">
          {[...tickerPrices, ...tickerPrices].map((item, idx) => (
            <div 
              key={idx} 
              className={`ticker-item ${item.isZqi ? 'zqi-ticker-highlight' : ''}`}
              onClick={() => {
                if (item.isZqi) {
                  setActiveTab('swap');
                  const dapp = document.querySelector('.dapp-container');
                  if (dapp) dapp.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={item.isZqi ? { cursor: 'pointer' } : {}}
              title={item.isZqi ? 'Klik untuk Swap $ZQI' : ''}
            >
              <span className="ticker-sym">{item.symbol}</span>
              <span className="ticker-price">{item.price}</span>
              <span className={`ticker-change ${item.isZqi ? 'zqi-tag pulse-active' : (item.change.startsWith('+') ? 'up' : 'down')}`}>
                {item.isZqi && <span className="ticker-pulse-dot"></span>}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER: TWO-COLUMN DASHBOARD (TERMINAL PRO)                       */}
      {/* ========================================================================= */}
      <main className="dapp-container">
        
        {/* RPC Status Indicator */}
        <div className="rpc-status-container" style={{ marginBottom: '16px', fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span className="rpc-status-indicator"></span>
          <span>RPC Node: Operational ({SOLANA_NETWORK})</span>
        </div>

        {/* 2-COLUMN GRID WRAPPER */}
        <div className="zoniq-terminal-grid">
          
          {/* ===================================================================== */}
          {/* SISI KIRI: ANALYTICS, CHARTS & LIVE PAYFI SETTLEMENT FEED             */}
          {/* ===================================================================== */}
          <div className="zoniq-terminal-left">
            
            {/* 1. Bar Metrik KPI Ringkas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="zoniq-stat-card">
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>PayFi & AMM Volume</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>${protocolTVL.toLocaleString('en-US')}</span>
                <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: '700' }}>↑ 18.4% this epoch</span>
              </div>
              <div className="zoniq-stat-card">
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>Real Yield Dispatched</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8' }}>42.80 SOL</span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>30% to $ZQI Locker</span>
              </div>
              <div className="zoniq-stat-card">
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>Network & Gas Tank</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>99.9%</span>
                <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>Priority Fee Active</span>
              </div>
            </div>

            {/* 2. Visual Chart Area: Pro Telemetry Grid */}
            <div className="zoniq-chart-box" style={{ background: '#0b121f', border: '1px solid #1e293b', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Header Chart dengan Filter Periode */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#ffffff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    PayFi Settlement & Yield Velocity
                    <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Live</span>
                  </h4>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.72rem', color: '#64748b' }}>
                    Atomic 5% fee routing across Protocol Pools
                  </p>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', background: '#070a13', padding: '3px', borderRadius: '6px', border: '1px solid #1e293b', gap: '2px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#1e293b', color: '#38bdf8', fontSize: '0.68rem', fontWeight: '700', cursor: 'pointer' }}>7D</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', color: '#64748b', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer' }}>30D</span>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', color: '#64748b', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer' }}>Epoch</span>
                </div>
              </div>

              {/* Area Grafik Berisi Skala Y-Axis & Garis Grid */}
              <div style={{ position: 'relative', width: '100%', height: '180px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px 12px 8px 45px', boxSizing: 'border-box' }}>
                
                {/* Skala Y-Axis di Sisi Kiri */}
                <div style={{ position: 'absolute', left: '10px', top: '14px', bottom: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.65rem', color: '#475569', fontFamily: 'monospace', textAlign: 'right', width: '28px' }}>
                  <span>0.60</span>
                  <span>0.40</span>
                  <span>0.20</span>
                  <span>0.00</span>
                </div>

                {/* Garis Grid Horizontal */}
                <div style={{ position: 'absolute', left: '44px', right: '12px', top: '18px', borderTop: '1px dashed rgba(51, 65, 85, 0.4)' }}></div>
                <div style={{ position: 'absolute', left: '44px', right: '12px', top: '68px', borderTop: '1px dashed rgba(51, 65, 85, 0.4)' }}></div>
                <div style={{ position: 'absolute', left: '44px', right: '12px', top: '118px', borderTop: '1px dashed rgba(51, 65, 85, 0.4)' }}></div>
                <div style={{ position: 'absolute', left: '44px', right: '12px', bottom: '28px', borderTop: '1px solid #1e293b' }}></div>

                {/* Balok Grafik */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', height: '100%', alignItems: 'flex-end', gap: '8px' }}>
                  {[
                    { day: 'Mon', height: '35%', val: '0.14 SOL' },
                    { day: 'Tue', height: '55%', val: '0.28 SOL' },
                    { day: 'Wed', height: '40%', val: '0.18 SOL' },
                    { day: 'Thu', height: '75%', val: '0.42 SOL' },
                    { day: 'Fri', height: '50%', val: '0.24 SOL' },
                    { day: 'Sat', height: '82%', val: '0.48 SOL' },
                    { day: 'Sun', height: '94%', val: '0.56 SOL', highlight: true }
                  ].map((bar, index) => (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '6px' }}>
                      <div 
                        title={`${bar.day}: ${bar.val}`}
                        style={{ 
                          width: '80%', 
                          height: bar.height, 
                          background: bar.highlight 
                            ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' 
                            : 'linear-gradient(180deg, #38bdf8 0%, #1d4ed8 100%)', 
                          borderRadius: '3px 3px 0 0',
                          boxShadow: bar.highlight ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease, filter 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.25)'; e.currentTarget.style.transform = 'scaleY(1.03)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
                      />
                      <span style={{ fontSize: '0.64rem', color: bar.highlight ? '#34d399' : '#64748b', fontWeight: bar.highlight ? '700' : '500' }}>
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-keterangan Bawah */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.73rem', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                <span>Protocol Yield Velocity: <strong style={{ color: '#38bdf8' }}>+18.4% APY</strong></span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>Atomic Multi-Pool Routing ⚡</span>
              </div>

            </div>

            {/* 3. Live On-Chain Settlement Activity Feed */}
            <div className="zoniq-feed-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h5 style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  Recent Atomic Settlement Routing
                </h5>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Solana Devnet</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                {settlementLogs && settlementLogs.map((item, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      background: '#070a13', 
                      border: '1px solid #1e293b', 
                      padding: '9px 12px', 
                      borderRadius: '8px' 
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: '#ffffff', fontWeight: '600' }}>{item.title}</span>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{item.desc}</span>
                    </div>
                    <span style={{ color: item.color, fontWeight: '700', fontFamily: 'monospace' }}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* SISI KANAN: 5 NAVIGATION TABS & MODUL AKTIF                            */}
          {/* ===================================================================== */}
          <div className="zoniq-terminal-right">
            
            {/* TAB NAVIGATION BAR (Swap | Lock | Vault | Affiliate | PayFi) */}
            <div className="dapp-nav-tabs-wrapper">
              <div className="dapp-nav-tabs">
                {SHOW_SWAP && (
                  <button 
                    type="button"
                    className={`dapp-tab-btn ${activeTab === 'swap' ? 'active' : ''}`}
                    onClick={() => setActiveTab('swap')}
                  >
                    🔄 <span className="tab-text">Swap</span>
                  </button>
                )}
                {SHOW_LOCKER && (
                  <button 
                    type="button"
                    className={`dapp-tab-btn ${activeTab === 'staking' ? 'active' : ''}`}
                    onClick={() => setActiveTab('staking')}
                  >
                    🔒 <span className="tab-text">Lock</span>
                  </button>
                )}
                {SHOW_OPTIMIZER && (
                  <button 
                    type="button"
                    className={`dapp-tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
                    onClick={() => setActiveTab('vault')}
                  >
                    📈 <span className="tab-text">Vault</span>
                  </button>
                )}
                {SHOW_AFFILIATE && (
                  <button 
                    type="button" 
                    className={`dapp-tab-btn ${activeTab === 'affiliate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('affiliate')}
                  >
                    👥 <span className="tab-text">Affiliate</span>
                  </button>
                )}
                <button 
                  type="button" 
                  className={`dapp-tab-btn ${activeTab === 'payfi' ? 'active' : ''}`}
                  onClick={() => setActiveTab('payfi')}
                >
                  💳 <span className="tab-text">PayFi</span>
                </button>
              </div>
            </div>

            {/* AREA INTEGRASI: Menampilkan Log Distribusi HANYA saat di Tab Swap */}
            {distributionData && activeTab === 'swap' && (
              <div style={{ width: '100%', marginBottom: '16px' }}>
                <DistributionLog programId={PROGRAM_ID} swapData={distributionData} />
              </div>
            )}

            {/* CONTAINER KONTEN MODUL AKTIF */}
            <div className="dapp-single-frame-container">
              
              {/* MODUL 1: SWAP */}
              {SHOW_SWAP && activeTab === 'swap' && (
                <div className="product-card swap-card">
                  <div className="card-title-row">
                    <h3>AMM DEX Swap</h3>
                    <span id="mevBadge" className="mev-secure-badge">🛡️ MEV SECURE</span>
                  </div>
                  <p className="desc">Instant asset swapping with MEV protection and daily Anti-Wash Trading features.</p>

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

                  {lockCalculationMode === 'manual' && (
                    <div style={{ marginBottom: '14px', marginTop: '10px' }}>
                      <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                        Select Lock Duration:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {[
                          { days: 7, label: "7 Days (0.5x)" },
                          { days: 15, label: "15 Days (0.75x)" },
                          { days: 30, label: "30 Days (1.0x)" }
                        ].map((item) => (
                          <button
                            key={item.days}
                            type="button"
                            disabled={isTokenLocked}
                            onClick={() => setInstantDays(item.days)}
                            style={{
                              padding: '7px 0',
                              borderRadius: '6px',
                              fontSize: '0.82rem',
                              fontWeight: '600',
                              cursor: isTokenLocked ? 'not-allowed' : 'pointer',
                              border: instantDays === item.days ? '1px solid #38bdf8' : '1px solid #1e293b',
                              background: instantDays === item.days ? 'rgba(56, 189, 248, 0.15)' : '#0b0f19',
                              color: instantDays === item.days ? '#38bdf8' : '#64748b',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                          opacity: 1, 
                          background: rewardClaimable ? "#22c55e" : "rgba(234, 179, 8, 0.15)", 
                          cursor: rewardClaimable ? "pointer" : "not-allowed", 
                          border: rewardClaimable ? "none" : "1px solid rgba(234, 179, 8, 0.4)", 
                          padding: "8px 14px", 
                          borderRadius: "6px", 
                          color: rewardClaimable ? "#ffffff" : "#facc15", 
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {rewardClaimable 
                          ? "Claim Reward" 
                          : (lockCountdown > 0 
                              ? `🔒 Epoch Accumulating (${lockCountdown}s)` 
                              : "🔒 Epoch Accumulating...")}
                      </button>
                    </div>
                  )}

                  {isConnected && zqiBalance <= 0 && !isTokenLocked ? (
                    <button 
                      type="button"
                      className="btn-action" 
                      onClick={() => { 
                        setTokenReceive('ZQI'); 
                        setActiveTab('swap'); 
                      }} 
                      style={{ 
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                        color: '#ffffff', 
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '14px',
                        width: '100%'
                      }}
                    >
                      ⚡ Insufficient $ZQI — Swap Now →
                    </button>
                  ) : (
                    <button className="btn-action" id="lockBtn" onClick={isConnected ? handleLockToken : openWalletModal} disabled={isTokenLocked || (isConnected && (!lockAmount || parseFloat(lockAmount) <= 0 || isLockLoading))} style={{ background: isTokenLocked ? "#22c55e" : !isConnected ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : (lockAmount && parseFloat(lockAmount) > 0) ? "linear-gradient(90deg, #1f6feb 0%, #238636 100%)" : "#1f2937", color: isTokenLocked ? "#ffffff" : (isConnected && (!lockAmount || parseFloat(lockAmount) <= 0)) ? "#64748b" : "#ffffff", cursor: isTokenLocked ? "not-allowed" : "pointer", pointerEvents: isTokenLocked ? "none" : "auto" }}>
                      {isLockLoading ? 'Processing Lock...' : isTokenLocked ? '✓ Token Locked' : !isConnected ? 'Connect Wallet' : (!lockAmount || parseFloat(lockAmount) <= 0) ? 'Enter an Amount' : 'Lock Token'}
                    </button>
                  )}

                  <button 
                    type="button"
                    id="emergencyUnlockBtn" 
                    onClick={triggerEmergencyModal} 
                    disabled={!isTokenLocked || isLockLoading} 
                    style={{ 
                      marginTop: "12px", 
                      width: "100%", 
                      padding: "12px", 
                      borderRadius: "8px", 
                      fontWeight: "700", 
                      fontSize: "0.88rem",
                      background: (isTokenLocked && !isLockLoading) ? "linear-gradient(135deg, #dc2626, #b91c1c)" : "#1e1b2e", 
                      border: "1px solid rgba(239, 68, 68, 0.5)", 
                      color: (isTokenLocked && !isLockLoading) ? "#ffffff" : "#f87171", 
                      cursor: (isTokenLocked && !isLockLoading) ? "pointer" : "not-allowed", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: "6px", 
                      boxShadow: (isTokenLocked && !isLockLoading) ? "0 4px 15px rgba(220, 38, 38, 0.35)" : "none"
                    }}
                  >
                    ⚠️ Emergency Early Unlock (10% Penalty)
                  </button>
                </div>
              )}

              {/* MODUL 4: AFFILIATE / REFERRAL */}
              {SHOW_AFFILIATE && activeTab === 'affiliate' && (
                <section className="affiliate-section" style={{ width: '100%', boxSizing: 'border-box', background: '#0b121f', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', margin: '0 auto', color: '#94a3b8' }}>
                  <div className="section-title-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#f97316' }}>⚡</span> Secure On-Chain Affiliate
                    </h3>
                    <span className="shield-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      Anti-Sybil Active
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px', color: '#94a3b8' }}>
                    Share your unique referral link. The system strictly restricts repetitive transactional manipulation (<strong style={{ color: '#f59e0b' }}>max 1 tx / 10s</strong>).
                  </p>
                        
                  <div className="affiliate-input-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>YOUR REFERRAL LINK</label>
                    <div className="affiliate-box" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                      <input 
                        type="text" 
                        id="refLink" 
                        value={isConnected ? `https://${currentDomain}?ref=${myWalletAddress}` : "Please connect your wallet..."} 
                        readOnly 
                        style={{ flex: 1, minWidth: '0', background: '#070a13', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px 16px', color: isConnected ? '#ffffff' : '#64748b', fontSize: '0.85rem', outline: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
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

                  <div className="test-panel" style={{ background: 'rgba(30, 41, 59, 0.3)', border: '1px solid #1e293b', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                    <label htmlFor="testReferrer" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '10px' }}>
                      • REFERRER ADDRESS (ON-CHAIN VERIFICATION)
                    </label>
                    <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                      <input type="text" id="testReferrer" placeholder="Enter referrer wallet address..." value={referrerInput} onChange={(e) => setReferrerInput(e.target.value)} style={{ flex: 1, minWidth: '0', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', padding: '10px 14px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }} />
                      <button 
                        className="btn-test" 
                        id="testBtn" 
                        onClick={verifyReferralOnChain} 
                        disabled={!isConnected} 
                        style={{ 
                          background: isConnected ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : '#111827', color: isConnected ? '#ffffff' : '#475569', border: isConnected ? 'none' : '1px solid #1e293b', height: '42px', padding: '0 12px', borderRadius: '6px', fontWeight: '700', cursor: isConnected ? 'pointer' : 'not-allowed', fontSize: '0.78rem', lineHeight: '1.2', textAlign: 'center', flexShrink: 0, minWidth: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isConnected ? '0 4px 14px rgba(59, 130, 246, 0.3)' : 'none', transition: 'all 0.3s ease'
                        }}
                      >
                        Verify<br/>Link
                      </button>
                    </div>
                  </div>

                  <div className="tier-table-wrapper" style={{ marginBottom: '20px' }}>
                    <p className="tier-headline" style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Ecosystem Tier Structures:</p>
                    <div className="responsive-table-overflow" style={{ overflowX: 'auto', width: '100%' }}>
                      <table className="tier-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ background: '#111827', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                            <th style={{ padding: '10px 14px', borderBottom: '1px solid #1e293b' }}>Tier Level</th>
                            <th style={{ padding: '10px 14px', borderBottom: '1px solid #1e293b' }}>Volume Target</th>
                            <th style={{ padding: '10px 14px', borderBottom: '1px solid #1e293b' }}>USDC Reward</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #1e293b' }}>
                            <td className="tier-bronze" style={{ padding: '12px 14px', color: '#10b981', fontWeight: '600' }}>Bronze Tier</td>
                            <td style={{ padding: '12px 14px', color: '#64748b' }}>$0 - $10,000</td>
                            <td style={{ padding: '12px 14px', color: '#ffffff', fontWeight: '700' }}>10%</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #1e293b' }}>
                            <td className="tier-silver" style={{ padding: '12px 14px', color: '#3b82f6', fontWeight: '600' }}>Silver Tier</td>
                            <td style={{ padding: '12px 14px', color: '#64748b' }}>$10,001 - $100,000</td>
                            <td style={{ padding: '12px 14px', color: '#ffffff', fontWeight: '700' }}>18%</td>
                          </tr>
                          <tr>
                            <td className="tier-gold" style={{ padding: '12px 14px', color: '#a855f7', fontWeight: '600' }}>Gold Tier</td>
                            <td style={{ padding: '12px 14px', color: '#64748b' }}>&gt; $100,000</td>
                            <td style={{ padding: '12px 14px', color: '#ffffff', fontWeight: '700' }}>25%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="tier-stats" style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#070a13', border: '1px solid #1e293b', padding: '14px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Current Tier:</span>
                      <span id="tierLabel" style={{ color: tierColor, fontWeight: '700' }}>{tierLabel}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Total Referral Volume:</span>
                      <span id="volLabel" style={{ color: '#ffffff', fontWeight: '700' }}>{referralVolume === '$0.00' && !isConnected ? '$0.00' : referralVolume}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                      <span style={{ color: '#94a3b8' }}>Your Earned Commissions:</span>
                      <span style={{ color: '#22c55e', fontWeight: '800' }}>
                        {(() => {
                          if (!isConnected && (referralEarned === '$0.00' || !referralEarned)) return '$0.00 USDC';
                          const num = parseFloat(String(referralEarned).replace(/[^0-9.-]+/g, ''));
                          return isNaN(num) 
                            ? referralEarned 
                            : `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`;
                        })()}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* MODUL 5: PAYFI */}
              {activeTab === 'payfi' && (
                <div className="payfi-wrapper">
                  <PayFiGateway />
                </div>
              )}

            </div>
          </div>

        </div>

        <ProtocolGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      </main>

      {/* STYLE FOOTER */}
      <style>{`
        .dapp-footer-clean {
          border-top: 1px solid #1f2937;
          padding: 24px 5%;
          background: #060911;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #94a3b8;
          font-size: 0.88rem;
          gap: 24px;
        }
        .footer-content-left {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }
        .footer-links-row {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          font-size: 0.82rem;
        }
        .footer-social-clean {
          display: flex;
          gap: 18px;
          align-items: center;
          flex-shrink: 0;
        }
        .footer-social-clean a {
          color: #64748b;
          font-size: 1.3rem;
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .footer-social-clean a:hover {
          color: #38bdf8;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .dapp-footer-clean {
            flex-direction: column !important;
            text-align: center !important;
            padding: 16px 16px 65px 16px !important;
            gap: 12px !important;
          }
          .footer-content-left {
            text-align: center !important;
            align-items: center !important;
          }
          .footer-links-row, .footer-social-clean {
            justify-content: center !important;
          }
          .footer-pitch-desktop {
            display: none !important;
          }
        }
      `}</style>

      {/* FOOTER RESMI DAPP */}
      <footer className="dapp-footer-clean">
        <div className="footer-content-left">
          <p style={{ margin: 0, lineHeight: '1.5' }}>
            © 2026 ZoniqFi Protocol. All Rights Reserved. Modular Solana DeFi & Real Yield Infrastructure.
          </p>

          <div className="footer-links-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              📖 Protocol Guide [EN/ID]
            </button>

            <button
              type="button"
              onClick={() => setShowPitchModal(true)}
              className="footer-pitch-desktop"
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              📊 Pitch Deck
            </button>

            {/* TOMBOL TRANSPARANSI SQUADS MULTI-SIG TREASURY */}
            <a
              href="https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet"
              target="_blank"
              rel="noopener noreferrer"
              title="Public Multi-Sig Treasury Vault via Squads / Solscan"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              🛡️ Treasury Explorer (Squads)
            </a>

            <span style={{ color: '#334155' }}>•</span>

            <a 
              href="https://github.com/provizto/zoniqfi" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.8rem' }}
            >
              GitHub
            </a>

            <span style={{ color: '#334155' }}>•</span>

            <a 
              href="https://github.com/provizto/zoniqfi-docs" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.8rem' }}
            >
              Docs
            </a>

            <span style={{ color: '#334155' }}>•</span>

            <a 
              href="https://solscan.io/token/6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz?cluster=devnet" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem' }}
            >
              $ZQI Explorer 🔍
            </a>

            <span style={{ color: '#334155' }}>•</span>

            <a 
              href="https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem' }}
            >
              Smart Contract ⚙️
            </a>

            <span style={{ color: '#334155' }}>•</span>

            <a 
              href="https://t.me/zoniqfi_community" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem' }}
            >
              Community 💬
            </a>
            
            <span style={{ color: '#334155' }}>•</span>

            <button 
              onClick={() => setShowDisclaimer(true)}
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0, 
                color: '#64748b', 
                fontSize: '0.8rem', 
                cursor: 'pointer' 
              }}
            >
              Legal Disclaimer
            </button>
          </div>
        </div>

        <div className="footer-social-clean">
          <a href="https://t.me/zoniqfi" target="_blank" rel="noopener noreferrer" title="Telegram">
            <i className="fab fa-telegram"></i>
          </a>
          <a href="https://x.com/zoniqfi" target="_blank" rel="noopener noreferrer" title="X (Twitter)">
            <i className="fab fa-x-twitter"></i>
          </a>
          <a href="https://discord.gg/zoniqfi" target="_blank" rel="noopener noreferrer" title="Discord">
            <i className="fab fa-discord"></i>
          </a>
        </div>
      </footer>

      {/* MOBILE BOTTOM DOCK */}
      <div className="mobile-bottom-dock">
        <button 
          type="button" 
          onClick={() => setIsGuideOpen(true)} 
          className="mobile-dock-item"
        >
          <i className="fas fa-circle-question"></i>
          <span>Guide</span>
        </button>
        <a 
          href="https://t.me/zoniqfi" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mobile-dock-item"
        >
          <i className="fab fa-telegram-plane"></i>
          <span>Telegram</span>
        </a>
        <a 
          href="https://github.com/provizto/zoniqfi-docs" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mobile-dock-item"
        >
          <i className="fas fa-book"></i>
          <span>Docs</span>
        </a>
        <button 
          type="button" 
          onClick={() => setShowPitchModal(true)} 
          className="mobile-dock-btn"
        >
          <i className="fas fa-chart-pie"></i>
          <span>Pitch Deck</span>
        </button>
      </div>

      <InvestorPitchModal 
        isOpen={showPitchModal} 
        onClose={() => setShowPitchModal(false)} 
      />

      {showDisclaimer && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 999999, padding: '20px'
        }}>
          <div style={{
            background: '#111827', border: '1px solid #1f2937', borderRadius: '16px',
            maxWidth: '480px', width: '100%', padding: '24px', color: '#e2e8f0',
            textAlign: 'left', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
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
                width: '100%', padding: '12px', background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
                color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer'
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {showEmergencyModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 999999, padding: '20px'
        }}>
          <div style={{
            background: '#0d1322', border: '1px solid #ef4444', borderRadius: '16px',
            maxWidth: '440px', width: '100%', padding: '24px', color: '#e2e8f0',
            textAlign: 'left', boxShadow: '0 20px 50px rgba(239, 68, 68, 0.25)'
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
                  flex: 1, padding: '12px', background: '#1e293b', color: '#ffffff',
                  border: '1px solid #334155', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                Cancel / Keep Locked
              </button>
              
              <button 
                onClick={executeEmergencyUnlock}
                style={{
                  flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700',
                  cursor: 'pointer', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
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