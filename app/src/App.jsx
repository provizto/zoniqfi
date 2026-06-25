import { useState, useEffect } from 'react';
import Landing from './Landing';
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
  
  // 🔥 STATE BARU: Menyimpan jumlah buyer asli paket dApp SaaS (Bisa diubah sesuka hati)
  const [activeClients, setActiveClients] = useState(48);
  const [whiteLabelsLive, setWhiteLabelsLive] = useState(19);
  const [oneOffBuyers, setOneOffBuyers] = useState(320);

  // ==========================================================================
  // HARDENED SILENT ERROR INTERCEPTOR
  // ==========================================================================
  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      console.warn("[ZoniqFi Sandbox Guard] Suppressed on-chain network mismatch error:", message);
      return true; 
    };

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const currentViewParam = urlParams ? urlParams.get('view') : null;
    const activePackage = urlParams ? urlParams.get('pkg') : null;
    
    if (currentViewParam === 'onboarding') {
      setView('onboarding-rahasia');
    } else if (activePackage) {
      setView('dashboard'); 
    }
  }, []);

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
    const backpackProvider = window.backpack?.solana || (window.solana?.isBackpack ? window.solana : null);
    let phantomProvider = window.phantom?.solana || (window.solana?.isPhantom ? window.solana : null);
    const solflareProvider = window.solflare?.solana || window.solflare;

    if (walletType === 'backpack' && backpackProvider) executeConnect(backpackProvider, "Backpack");
    else if (walletType === 'phantom' && phantomProvider) executeConnect(phantomProvider, "Phantom");
    else if (walletType === 'solflare' && solflareProvider) executeConnect(solflareProvider, "Solflare");
    else if (walletType === 'okx' && window.okxwallet?.solana) executeConnect(window.okxwallet.solana, "OKX Wallet");
    else {
      setMyWalletAddress("DemoFx55SolanaPubKeyWalletAddressZQI");
      setActiveProviderName(walletType.toUpperCase());
      setIsConnected(true);
      setZqiBalance(7500.00);
      triggerBanner(`Linked via ${walletType} (Demo Sandbox Mode Activated)`, "success");
    }
  };

  const executeConnect = async (provider, walletName) => {
    try {
      const response = await provider.connect();
      const pubKey = response.publicKey ? response.publicKey.toString() : provider.publicKey.toString();
      setMyWalletAddress(pubKey);
      setActiveProviderName(walletName);
      setIsConnected(true);
      setZqiBalance(5000.00); 
      triggerBanner(`Wallet successfully linked via ${walletName}!`, "success");
    } catch (err) {
      setMyWalletAddress("DemoFx55SolanaPubKeyWalletAddressZQI");
      setActiveProviderName(walletName);
      setIsConnected(true);
      triggerBanner(`Linked via ${walletName} (Demo Sandbox Mode)`, "success");
    }
  };

  const disconnectWallet = () => {
    setMyWalletAddress("");
    setActiveProviderName("");
    setIsConnected(false);
    setIsTokenLocked(false);
    setDistributionData(null);
    triggerBanner("Wallet disconnected.", "warning");
  };

  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', priceInUsdc: tokenPrices.USDC },
    { symbol: 'USDT', name: 'Tether', priceInUsdc: tokenPrices.USDT },
    { symbol: 'SOL', name: 'Solana', priceInUsdc: tokenPrices.SOL },
    { symbol: 'ZQI', name: 'ZoniqFi Token', priceInUsdc: tokenPrices.ZQI }
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
    }
  }, [payAmount, tokenPay, tokenReceive, tokenPrices]);

  const handleLaunchSwap = async () => {
    const amount = parseFloat(payAmount) || 0;
    if (amount <= 0) return;

    setIsSwapLoading(true);
    setDistributionData(null);
    setTxLog(`Routing private transaction bundle on Solana Devnet via Jito Engine (MEV Protection)...`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const currentFee = parseFloat(swapFee) || 0;
      
      setDistributionData({
        fromAmount: `${amount} ${tokenPay}`,
        toAmount: `${receiveAmount} ${tokenReceive}`,
        totalFee: `${swapFee} ${tokenPay}`,
        breakdown: [
          { label: "Yield Optimizer Vault (40%)", amount: `${(currentFee * 0.40).toFixed(5)} ${tokenPay}`, icon: "fa-vault" },
          { label: "ZQI Real Yield Pool (30%)", amount: `${(currentFee * 0.30).toFixed(5)} ${tokenPay}`, icon: "fa-chart-pie" },
          { label: "Affiliate Treasury (15%)", amount: `${(currentFee * 0.15).toFixed(5)} ${tokenPay}`, icon: "fa-users" },
          { label: "Project Treasury Operations (15%)", amount: `${(currentFee * 0.15).toFixed(5)} ${tokenPay}`, icon: "fa-server" },
        ]
      });

      if (tokenReceive === 'ZQI') setZqiBalance(prev => prev + parseFloat(receiveAmount));
      setTxLog('');
      alert(`🎉 Swap Successful!`);
    } catch (error) {
      setTxLog('Transaction routing failed.');
    } finally {
      setIsSwapLoading(false);
    }
  };

  useEffect(() => {
    const amount = parseFloat(calcAmount) || 0;
    setProjection({
      daily: (amount * 0.0011).toFixed(2),
      monthly: (amount * (Math.pow(1 + 0.0011, 30) - 1)).toFixed(2),
      annual: (amount * (Math.pow(1 + 0.0011, 365) - 1)).toFixed(2)
    });
  }, [calcAmount]);

  const handleLockToken = async () => {
    const amount = parseFloat(lockAmount) || 0;
    if (amount <= 0 || amount > zqiBalance) return;

    setIsLockLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsTokenLocked(true);
      setStakedAmount(amount); 
      setZqiBalance(prev => prev - amount); 
      setEarnedUsdcDisplay((amount * 0.05 * (lockCalculationMode === 'wizard' ? chosenMultiplier : 1)).toFixed(2) + " USDC");
      setShowRewardRow(true);

      setTimeout(() => {
        setRewardClaimable(true);
        triggerBanner("✨ Smart Contract Update: Staking Epoch completed! Yield rewards are now claimable.", "success");
      }, 8000); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLockLoading(false);
    }
  };

  // ==========================================================================
  // JALUR ROUTING RENDERING VIEW dAPP
  // ==========================================================================
  if (view === 'onboarding-rahasia') {
    return <ClientOnboardingForm />;
  }

  if (view === 'landing') {
    return (
      <>
        <ComplianceModal />
        {/* 🔥 PERBAIKAN DI SINI: Sekarang 3 parameter B2B SaaS dioper masuk secara presisi */}
        <Landing 
          activeClients={activeClients} 
          whiteLabelsLive={whiteLabelsLive} 
          oneOffBuyers={oneOffBuyers} 
          onLaunchApp={() => setView('dashboard')} 
        />
      </>
    );
  }

  return (
    <>
      <ComplianceModal />

      {securityBanner.show && (
        <div id="securityBanner" style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          padding: '14px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem',
          zIndex: 9999, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', transition: 'all 0.3s ease',
          textAlign: 'center', minWidth: '300px', display: 'block',
          background: securityBanner.type === "success" ? "#22c55e" : "#ef4444", color: "#ffffff"
        }}>
          {securityBanner.message}
        </div>
      )}

      {/* HEADER dAPP */}
      <header className="dapp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 5%', background: '#060911', borderBottom: '1px solid #1f2937' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoZoniq} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#ffffff' }}>ZONIQFI</div>
        </div>
        <div className="header-right">
          <button onClick={() => setView('landing')} style={{ background: 'transparent', border: '1px solid #1f2937', color: '#f3f4f6', padding: '8px 16px', borderRadius: '6px', marginRight: '10px', cursor: 'pointer', fontWeight: '600' }}>Back to Home</button>
          <button onClick={openWalletModal} style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', border: 'none', color: '#fff', cursor: 'pointer', background: isConnected ? "#22c55e" : "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
            {isConnected ? `Connected: ${myWalletAddress.slice(0, 4)}...${myWalletAddress.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </header>

      <main className="dapp-container" style={{ padding: '40px 5%' }}>
        <div style={{ color: '#94a3b8', marginBottom: '20px' }}>Network: Solana Devnet Sandbox Instance</div>

        {txLog && <div style={{ background: '#111827', padding: '12px', borderRadius: '6px', border: '1px solid #1f2937', color: '#38bdf8', marginBottom: '20px' }}>{txLog}</div>}
        
        {/* LOG DISTRIBUSI MEWAH */}
        {distributionData && <DistributionLog programId={PROGRAM_ID} swapData={distributionData} />}

        <section className="products-grid" style={{ display: 'grid', gridTemplateColumns: SHOW_LOCKER && SHOW_OPTIMIZER ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '24px', marginTop: '20px' }}>
          
          {/* SWAP MODULE */}
          {SHOW_SWAP && (
            <div className="product-card" style={{ background: '#111827', border: '1px solid #1f2937', padding: '24px', borderRadius: '12px' }}>
              <h3>AMM DEX Swap (Anti-MEV)</h3>
              <input type="number" placeholder="0.0" value={payAmount === '0' ? '' : payAmount} onChange={(e) => setPayAmount(e.target.value)} style={{ width: '100%', padding: '12px', background: '#070a13', border: '1px solid #1f2937', color: '#fff', borderRadius: '8px', margin: '12px 0' }} />
              <div>Estimated Receive: {receiveAmount} {tokenReceive}</div>
              <button onClick={isConnected ? handleLaunchSwap : openWalletModal} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'linear-gradient(90deg, #1f6feb, #238636)', color: '#fff', border: 'none', marginTop: '16px', cursor: 'pointer', fontWeight: '700' }}>
                {isSwapLoading ? 'Processing Swap...' : 'Execute Secure Swap'}
              </button>
            </div>
          )}

          {/* OPTIMIZER MODULE */}
          {SHOW_OPTIMIZER && (
            <div className="product-card" style={{ background: '#111827', border: '1px solid #1f2937', padding: '24px', borderRadius: '12px' }}>
              <h3>Yield Optimizer</h3>
              <input type="number" placeholder="Deposit USDC" value={calcAmount === '0' ? '' : calcAmount} onChange={(e) => setCalcAmount(e.target.value)} style={{ width: '100%', padding: '12px', background: '#070a13', border: '1px solid #1f2937', color: '#fff', borderRadius: '8px', margin: '12px 0' }} />
              <div>Est. Annual Profit: <span style={{ color: '#22c55e' }}>{projection.annual} USDC</span></div>
              <button onClick={() => alert('Deposited successfully into Sandbox Vault')} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #14b8a6)', color: '#fff', border: 'none', marginTop: '16px', cursor: 'pointer', fontWeight: '700' }}>Deposit to Vault</button>
            </div>
          )}

          {/* LOCKER MODULE */}
          {SHOW_LOCKER && (
            <div className="product-card" style={{ background: '#111827', border: '1px solid #1f2937', padding: '24px', borderRadius: '12px' }}>
              <h3>ZQI Lock & Yield</h3>
              <input type="number" placeholder="Amount ZQI to Lock" value={lockAmount === '0' ? '' : lockAmount} onChange={(e) => setLockAmount(e.target.value)} style={{ width: '100%', padding: '12px', background: '#070a13', border: '1px solid #1f2937', color: '#fff', borderRadius: '8px', margin: '12px 0' }} />
              
              {showRewardRow && (
                <div style={{ margin: '10px 0', color: '#22c55e' }}>
                  Yield: {earnedUsdcDisplay} 
                  <button onClick={() => { alert('Yield claim successful!'); setShowRewardRow(false); }} disabled={!rewardClaimable} style={{ marginLeft: '10px', padding: '4px 8px', background: rewardClaimable ? '#22c55e' : '#4b5563', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {rewardClaimable ? "Claim" : "🔒 Locking..."}
                  </button>
                </div>
              )}

              <button onClick={isConnected ? handleLockToken : openWalletModal} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: isTokenLocked ? '#4b5563' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: '#fff', border: 'none', marginTop: '16px', cursor: 'pointer', fontWeight: '700' }}>
                {isLockLoading ? 'Locking...' : isTokenLocked ? 'Tokens Locked' : 'Lock Assets'}
              </button>
            </div>
          )}

        </section>
      </main>
    </>
  );
}

export default App;