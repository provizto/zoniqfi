import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import PayFiGateway from '../PayFiGateway';

// SVG Ikon Resmi & Asli (Ukuran Valid 20px / w-5 h-5)
const Icons = {
  Twitter: () => (
    <svg className="w-5 h-5 fill-current text-white shrink-0" width="20" height="20" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Telegram: () => (
    <svg className="w-5 h-5 fill-current text-sky-400 shrink-0" width="20" height="20" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  ),
  Discord: () => (
    <svg className="w-5 h-5 fill-current text-indigo-400 shrink-0" width="20" height="20" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
  GitHub: () => (
    <svg className="w-5 h-5 fill-current text-slate-300 shrink-0" width="20" height="20" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  Guide: () => (
    <svg className="w-5 h-5 text-cyan-400 shrink-0" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Pitch: () => (
    <svg className="w-5 h-5 text-emerald-400 shrink-0" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Treasury: () => (
    <svg className="w-5 h-5 text-cyan-400 shrink-0" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Explorer: () => (
    <svg className="w-5 h-5 text-cyan-400 shrink-0" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
};

const TICKERS = [
  { symbol: 'ZQI', price: '$0.0500', isPositive: true, badge: 'PRESALE' },
  { symbol: 'SOL', price: '$115.10', change: '-3.04%', isPositive: false },
  { symbol: 'JUP', price: '$0.288', change: '-5.34%', isPositive: false },
  { symbol: 'RENDER', price: '$1.77', change: '-5.26%', isPositive: false },
  { symbol: 'BONK', price: '$0.000012', change: '+7.29%', isPositive: true },
  { symbol: 'BTC', price: '$64,250', change: '+2.15%', isPositive: true },
];

// ============================================================================
// KOMPONEN MODUL AFFILIATE
// ============================================================================
const MobileAffiliateTab = ({
  wallet,
  onConnectWallet,
  referrerInput = '',
  setReferrerInput = () => {},
  referralVolume = '$0.00',
  referralEarned = '$0.00 USDC',
  tierLabel = 'Bronze (10%)',
  tierColor = '#10b981',
  onCopyLink,
  onVerifyReferral,
  currentDomain = 'zoniqfi.com'
}) => {
  const isConnected = wallet?.isConnected;
  const refLink = isConnected
    ? `https://${currentDomain}?ref=${wallet?.address}`
    : 'Please connect your wallet...';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
      {/* 1. Header & Badge Anti-Sybil */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-orange-500 text-lg">⚡</span>
            <span>Secure On-Chain Affiliate</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mt-1">
            Share your unique referral link. The system strictly restricts repetitive transactional manipulation (<strong className="text-amber-400 font-mono">max 1 tx / 10s</strong>).
          </p>
        </div>
        <span className="shrink-0 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">
          Anti-Sybil Active
        </span>
      </div>

      {/* 2. Your Referral Link */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-tech">
          YOUR REFERRAL LINK
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={refLink}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 flex-1 outline-none truncate"
          />
          <button
            type="button"
            onClick={isConnected ? onCopyLink : onConnectWallet}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white shrink-0 active:scale-95 transition shadow-md ${
              isConnected
                ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-violet-900/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isConnected ? 'Copy Link' : 'Connect'}
          </button>
        </div>
      </div>

      {/* 3. Referrer Verification Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-tech">
          • REFERRER ADDRESS (ON-CHAIN VERIFICATION)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter referrer wallet address..."
            value={referrerInput}
            onChange={(e) => setReferrerInput(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 flex-1 outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={onVerifyReferral}
            disabled={!isConnected}
            className={`px-3 py-2 rounded-lg text-xs font-bold shrink-0 transition ${
              isConnected
                ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            Verify
          </button>
        </div>
      </div>

      {/* 4. Ecosystem Tier Structures Table */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-white tracking-wide">Ecosystem Tier Structures:</div>
        <div className="overflow-hidden border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 font-tech">
              <tr>
                <th className="py-2.5 px-3">Tier Level</th>
                <th className="py-2.5 px-3">Volume Target</th>
                <th className="py-2.5 px-3 text-right">USDC Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-400">Bronze Tier</td>
                <td className="py-2.5 px-3 text-slate-300 font-mono">$0 - $10,000</td>
                <td className="py-2.5 px-3 font-black text-white text-right font-tech">10%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-blue-400">Silver Tier</td>
                <td className="py-2.5 px-3 text-slate-300 font-mono">$10,001 - $100,000</td>
                <td className="py-2.5 px-3 font-black text-white text-right font-tech">18%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-purple-400">Gold Tier</td>
                <td className="py-2.5 px-3 text-slate-300 font-mono">&gt; $100,000</td>
                <td className="py-2.5 px-3 font-black text-white text-right font-tech">25%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Tier Stats Summary Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Current Tier:</span>
          <span className="font-bold text-xs font-tech" style={{ color: tierColor }}>
            {tierLabel}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Total Referral Volume:</span>
          <span className="font-bold text-white font-mono text-xs">
            {referralVolume}
          </span>
        </div>
        <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
          <span className="text-slate-300 font-semibold">Your Earned Commissions:</span>
          <span className="font-extrabold text-emerald-400 font-mono text-sm">
            {referralEarned}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PAYFI MODULE (DIGITAL CORE COMMERCE GATEWAY)
// ============================================================================
const MobilePayFiTab = ({
  wallet,
  onConnectWallet,
  onBuyProduct = () => {},
  onVerifyLicense = () => {},
  onOpenVendor = () => {},
  productsData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const defaultProducts = [
    {
      id: 'SKU-02',
      sku: 'SKU-02',
      category: 'Software & Source Code',
      categoryIcon: '💻',
      vendor: '9bvd18...3ahs',
      title: 'Next.js PayFi Storefront Template',
      description: 'Full-stack Web3 eCommerce kit with automated Solana relayer settlement, instant license issuing, and admin analytics.',
      priceSol: '0.015 SOL',
      priceUsd: '≈ $52.50 USD',
    },
    {
      id: 'SKU-03',
      sku: 'SKU-03',
      category: 'Software & Source Code',
      categoryIcon: '💻',
      vendor: '9bvd18...3ahs',
      title: 'Web3 Publishing & Editorial CMS',
      description: 'Comprehensive digital media and publishing platform featuring editorial workflow hierarchy, access control, and crypto micro-settlements.',
      priceSol: '0.037 SOL',
      priceUsd: '≈ $129.50 USD',
    }
  ];

  const items = productsData || defaultProducts;

  const filteredItems = items.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4 pb-4">
      
      {/* 1. Header Banner & Quick Action Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-orange-500 font-bold text-base">⚡</span>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wider font-tech">ZONIQFI DIGITAL CORE</h2>
              <p className="text-[11px] text-slate-400">Hybrid Web3 & Fiat Commerce Gateway</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full font-mono font-bold">
            Solana Relayer
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={onVerifyLicense}
            className="flex items-center justify-center gap-1.5 bg-slate-950 border border-slate-800 hover:border-cyan-600/50 py-2 px-2 rounded-xl text-xs font-bold text-cyan-400 active:scale-95 transition"
          >
            <span>🔍</span>
            <span className="truncate">Verify License</span>
          </button>
          <button
            onClick={onOpenVendor}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 py-2 px-2 rounded-xl text-xs font-bold text-slate-950 active:scale-95 transition shadow-sm"
          >
            <span>🚀</span>
            <span className="truncate">Vendor Portal</span>
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-admin-portal'))}
            className="flex items-center justify-center gap-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 py-2 px-2 rounded-xl text-xs font-bold text-slate-300 active:scale-95 transition"
          >
            <span>⚙️</span>
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            PAYFI COLLATERAL VAULT
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded font-bold">
            Devnet Node
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-tech">Total Volume</div>
            <div className="text-xs font-bold text-cyan-400 mt-0.5">0.052 SOL</div>
            <div className="text-[9px] text-emerald-400">↑ On-Chain</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-tech">Licenses</div>
            <div className="text-xs font-bold text-white mt-0.5">2 Issued</div>
            <div className="text-[9px] text-cyan-400">NFT Receipt</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-tech">Finality</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">~1.2 Sec</div>
            <div className="text-[9px] text-slate-400">Instant Pay</div>
          </div>
        </div>
      </div>

      {/* 3. Search Bar & Category Filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <span className="absolute left-3.5 top-3 text-sm text-slate-500">🔍</span>
          <input
            type="text"
            placeholder="Search license, creator, SKU, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs font-semibold">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap text-xs transition ${
              selectedCategory === 'All'
                ? 'bg-cyan-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setSelectedCategory('Software')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap text-xs transition ${
              selectedCategory === 'Software'
                ? 'bg-cyan-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>💻</span>
            <span>Software & Source Code</span>
          </button>
        </div>
      </div>

      {/* 4. Product Catalog Cards (Compact Ramping Style + Buy Button) */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-xs px-1 mb-1">
          <span className="font-bold text-white flex items-center gap-2">
            <span className="text-base">🛍️</span>
            <span>Digital Products & Licenses</span>
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {filteredItems.length} Active Items
          </span>
        </div>

        {filteredItems.map((prod) => (
          <div
            key={prod.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-3 rounded-2xl flex items-center justify-between gap-3 transition active:scale-[0.99]"
          >
            {/* Sisi Kiri: Ikon Kotak + Judul & Vendor */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-base shrink-0 shadow-inner">
                📦
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white truncate leading-tight">
                  {prod.title}
                </h3>
                <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                  Vendor: {prod.vendor}
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Harga Cyan + Tombol Beli Berisi */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-xs font-bold text-cyan-400 font-mono">
                  {prod.priceSol}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {prod.priceUsd}
                </div>
              </div>

              <button
                onClick={() => onBuyProduct(prod)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-md shadow-blue-900/30"
              >
                <span>🛒</span>
                <span>Buy</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function MobileView({ 
  wallet, 
  onConnectWallet, 
  onDisconnectWallet, 
  onOpenGuide, 
  onOpenPitch, 
  onUpdateWallet,
  onVaultDeposit,
  distributionData,
  PROGRAM_ID,

  // Props Riil PayFi
  products = [],
  productsData,
  onBuyProduct,
  onVerifyLicense,
  onOpenVendor,
  solPriceUsd = 145,

  // Props Swap
  payAmount,
  setPayAmount,
  receiveAmount,
  tokenPay,
  handleTokenChange,
  tokenReceive,
  tokens,
  switchTokens,
  swapFee,
  isSwapLoading,
  onLaunchSwap,

  // Props Lock
  protocolTVL,
  isTokenLocked,
  stakedAmount,
  isLockLoading,
  lockCalculationMode,
  switchLockCalculationView,
  lockAmount,
  setLockAmount,
  instantDays,
  setInstantDays,
  chosenMultiplier,
  setChosenMultiplier,
  liveScore,
  estimatedRewardText,
  showRewardRow,
  earnedUsdcDisplay,
  rewardClaimable,
  claimZqiReward,
  lockCountdown,
  onLockToken,
  triggerEmergencyModal,
  onGoToSwap,

  // Props Affiliate
  referrerInput,
  setReferrerInput,
  referralVolume,
  referralEarned,
  tierLabel,
  tierColor,
  onCopyLink,
  onVerifyReferral,
  currentDomain
}) {

  const [activeTab, setActiveTab] = useState('Swap');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // State Filter & Search Riil PayFi
  const [payfiSearch, setPayfiSearch] = useState('');
  const [payfiCategory, setPayfiCategory] = useState('All');

  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isAtomicOpen, setIsAtomicOpen] = useState(false);
  const [chartTf, setChartTf] = useState('15m');

  const [vaultAmount, setVaultAmount] = useState('');
  const numVault = parseFloat(vaultAmount) || 0;
  const estDaily = (numVault * 0.0011).toFixed(4);
  const estMonthly = (numVault * 0.0011 * 30).toFixed(4);
  const estYearly = (numVault * 0.491).toFixed(4);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter Produk Aktif secara Real-Time
  const filteredProducts = (products || []).filter((item) => {
    const matchCat = payfiCategory === 'All' || item.category === payfiCategory;
    const matchKeyword = !payfiSearch || 
      item.title?.toLowerCase().includes(payfiSearch.toLowerCase()) ||
      item.sku?.toLowerCase().includes(payfiSearch.toLowerCase()) ||
      item.description?.toLowerCase().includes(payfiSearch.toLowerCase());
    return matchCat && matchKeyword;
  });

  const categories = ['All', ...new Set((products || []).map((p) => p.category).filter(Boolean))];

  useEffect(() => {
    if (isChartOpen && chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      const tfData = {
        '15m': [0.042, 0.044, 0.041, 0.046, 0.048, 0.047, 0.050],
        '1h':  [0.035, 0.038, 0.040, 0.042, 0.045, 0.049, 0.050],
        '4h':  [0.020, 0.028, 0.032, 0.039, 0.044, 0.048, 0.050],
        '1d':  [0.010, 0.015, 0.025, 0.030, 0.040, 0.045, 0.050]
      };

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30'],
          datasets: [{
            label: '$ZQI Price',
            data: tfData[chartTf] || tfData['15m'],
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [isChartOpen, chartTf]);

  return (
    <div className="bg-slate-950 text-slate-100 font-['Space_Grotesk'] antialiased min-h-screen flex flex-col w-full relative select-none">
      
      {/* IMPORT GOOGLE FONTS & STYLING FUTURISTIK */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

        .font-tech {
          font-family: 'Chakra Petch', sans-serif !important;
        }

        @keyframes marqueeScrollAnimation {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .zoniq-marquee-active {
          display: flex !important;
          width: max-content !important;
          animation: marqueeScrollAnimation 22s linear infinite !important;
        }
        .zoniq-marquee-active:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* 1. RUNNING TEXT MARQUEE */}
      <div className="bg-slate-950 border-b border-slate-800/80 overflow-hidden py-2 text-xs font-mono sticky top-0 z-40">
        <div className="zoniq-marquee-active items-center gap-7 whitespace-nowrap">
          {[...TICKERS, ...TICKERS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {item.badge ? (
                <span className="inline-flex items-center gap-1.5 border border-cyan-500/50 bg-cyan-950/60 px-2.5 py-0.5 rounded-full text-cyan-300 font-bold font-tech">
                  <span className="text-white font-extrabold">${item.symbol}</span>
                  <span>{item.price}</span>
                  <span className="bg-cyan-500 text-slate-950 px-1.5 rounded text-[9px] font-black uppercase">
                    {item.badge}
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-300 font-mono">
                  <strong className="text-white">{item.symbol}</strong>
                  <span>{item.price}</span>
                  <span className={item.isPositive ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                    {item.change}
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. MOBILE HEADER */}
      <header className="px-3.5 py-2.5 flex justify-between items-center border-b border-slate-800 bg-slate-900/95 sticky top-8 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-cyan-600 rounded-md flex items-center justify-center font-black text-xs text-white shadow-sm font-tech">
            Z
          </div>
          <span className="text-sm font-extrabold tracking-wider text-white font-tech">ZONIQFI</span>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded font-bold font-mono">
            $ZQI
          </span>
        </div>

        <div className="flex items-center gap-2 relative">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-lg font-mono">
  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
  Devnet
</div>
        
        {/* --- TAMBAHKAN: BADGE LINK GUARD DI HEADER --- */}
          <a
            href="https://guard.zoniqfi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-700/60 px-2 py-1 rounded-lg font-mono hover:bg-emerald-900/60 transition"
          >
            🛡️ Guard
          </a>

          <button
            onClick={() => {
              if (onConnectWallet && !wallet?.isConnected) {
                onConnectWallet();
              } else {
                setIsWalletOpen(!isWalletOpen);
              }
            }}
            className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition font-mono shadow-sm"
          >
            <span className="w-2 h-2 bg-slate-950 rounded-full" />
            <span>{wallet?.isConnected ? `${wallet.address?.slice(0, 4)}...${wallet.address?.slice(-4)}` : 'Connect'}</span>
          </button>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-200 hover:text-white transition text-sm font-bold active:scale-95"
          >
            ☰
          </button>

          {/* WALLET MODAL POPUP */}
          {isWalletOpen && (
            <div className="absolute top-11 right-0 w-52 bg-slate-900 border border-slate-700 rounded-2xl p-3.5 z-50 font-mono text-xs shadow-2xl space-y-2.5">
              <div className="space-y-1.5 pb-2.5 border-b border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">SOL Balance</span>
                  <span className="font-bold text-emerald-400">{wallet?.solBalance ?? '2.850'} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">USDC Balance</span>
                  <span className="font-bold text-cyan-400">{typeof wallet?.usdcBalance === 'number' ? wallet.usdcBalance.toFixed(2) : '50.00'} USDC</span>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(wallet?.address || '9bvD8xK29uH3x19aB283AhS');
                  showToast('Address disalin ke Clipboard!');
                  setIsWalletOpen(false);
                }}
                className="w-full text-left text-xs text-slate-300 hover:text-white py-1 block"
              >
                📋 Copy Address
              </button>
              <button
                onClick={() => {
                  if (onDisconnectWallet) {
                    onDisconnectWallet();
                  } else if (onUpdateWallet) {
                    onUpdateWallet(prev => ({ ...prev, isConnected: !prev.isConnected }));
                  }
                  setIsWalletOpen(false);
                  showToast(wallet?.isConnected ? 'Wallet Disconnected' : 'Wallet Connected');
                }}
                className="w-full text-left text-red-400 font-bold text-xs pt-1.5 border-t border-slate-800 block"
              >
                {wallet?.isConnected ? '📕 Disconnect' : '🟢 Connect'}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 3. DRAWER MENU (☰) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-76 h-full bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-3 mb-5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-cyan-600 rounded-md flex items-center justify-center font-black text-xs text-white font-tech">Z</div>
                  <span className="font-bold text-sm text-white font-tech tracking-wider">ZONIQFI ECOSYSTEM</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs">✕</button>
              </div>

              {/* 5 Item Navigasi Utama */}
              <div className="space-y-1.5 mb-6 text-sm text-slate-200">
                {/* --- TAMBAHKAN: LINK KE ZONIQ GUARD SCANNER --- */}
                <a
                  href="https://guard.zoniqfi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-left transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 text-center text-base">🛡️</span>
                    <div>
                      <div className="text-sm font-bold text-emerald-400">Zoniq Guard</div>
                      <div className="text-[10px] text-slate-400">Security & AST Audit Scanner</div>
                    </div>
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                    Live ↗
                  </span>
                </a>

                <button 
                  type="button"
                  onClick={() => { 
                    if (onOpenGuide) onOpenGuide(); 
                    setIsMenuOpen(false); 
                  }} 
                  className="w-full flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-800 text-left transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 text-center text-base">📖</span>
                    <span className="text-sm text-slate-200 font-medium">Protocol Guide [EN/ID]</span>
                  </span>
                  <span className="text-xs text-cyan-400 font-mono font-bold">
                    Read
                  </span>
                </button>

                <button 
                  type="button"
                  onClick={() => { 
                    if (onOpenPitch) onOpenPitch(); 
                    setIsMenuOpen(false); 
                  }} 
                  className="w-full flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-800 text-left transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 text-center text-base">📊</span>
                    <span className="text-sm text-slate-200 font-medium">Pitch Deck</span>
                  </span>
                  <span className="text-xs text-cyan-400 font-mono font-bold">
                    Deck
                  </span>
                </button>

                <a
                  href="https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-800 text-left transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 flex items-center justify-center">
                      <Icons.Treasury />
                    </span>
                    <span className="text-sm text-slate-200 font-medium">Treasury Explorer</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    Squads
                  </span>
                </a>

                <a
                  href="https://solscan.io/token/6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz?cluster=devnet"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-800 text-left transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 flex items-center justify-center">
                      <Icons.Explorer />
                    </span>
                    <span className="text-sm text-slate-200 font-medium">$ZQI Explorer</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">
                    Solana
                  </span>
                </a>

                {/* Tombol Vendor Portal & Admin */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('PayFi');
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent("open-vendor-portal"));
                    }, 150);
                  }}
                  className="w-full flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-800 text-left text-emerald-400 font-bold transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 text-center text-base">🚀</span>
                    <span className="text-sm">Vendor Portal</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('PayFi');
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent("open-admin-portal"));
                    }, 150);
                  }}
                  className="w-full flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-800 text-left text-slate-300 font-semibold transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 text-center text-base">⚙️</span>
                    <span className="text-sm">Admin Settings</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">PIN</span>
                </button>
              </div>

              {/* Media Sosial dengan Ikon Asli & Bahasa Inggris Utuh */}
              <div className="pt-4 border-t border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1 font-tech">
                  SOCIAL MEDIA & COMMUNITY
                </span>
                <div className="space-y-1 text-sm text-slate-300">
                  <a
                    href="https://x.com/zoniqfi"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-2.5 flex justify-between items-center rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center">
                        <Icons.Twitter />
                      </span>
                      <span className="text-sm font-medium">Twitter</span>
                    </span>
                    <span className="text-xs text-slate-500 font-mono">@ZoniqFi</span>
                  </a>

                  <a
                    href="https://t.me/zoniqfi"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-2.5 flex justify-between items-center rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center">
                        <Icons.Telegram />
                      </span>
                      <span className="text-sm font-medium">Telegram</span>
                    </span>
                    <span className="text-xs text-slate-500">Community</span>
                  </a>

                  <a
                    href="https://discord.gg/zoniqfi"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-2.5 flex justify-between items-center rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center">
                        <Icons.Discord />
                      </span>
                      <span className="text-sm font-medium">Discord</span>
                    </span>
                    <span className="text-xs text-slate-500">Server</span>
                  </a>

                  <a
                    href="https://github.com/provizto/zoniqfi"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full p-2.5 flex justify-between items-center rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center">
                        <Icons.GitHub />
                      </span>
                      <span className="text-sm font-medium">GitHub</span>
                    </span>
                    <span className="text-xs text-slate-500">Source Code</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Drawer */}
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 space-y-1.5">
              <div className="flex justify-between items-center">
                <span>RPC Node Status</span>
                <span className="text-emerald-400 font-mono font-bold">Operational</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span>Anti-Wash Trading Check</span>
                <span className="text-emerald-400 font-bold">Active (Daily)</span>
              </div>
              <div className="text-[10px] text-slate-600 text-center pt-2.5 border-t border-slate-800/60 font-mono">
                © 2026 ZoniqFi Protocol
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto p-3.5 space-y-3.5 pb-24">
        
        {/* Strip 3 Metrik (Lebih Besar & Tegas) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex justify-between items-center text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-tech">PayFi & AMM</span>
            <span className="font-bold text-white text-xs font-mono">$1,252,928</span>
            <span className="text-[10px] text-emerald-400 block font-medium">↑ 18.4% epoch</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-tech">Real Yield</span>
            <span className="font-bold text-cyan-400 text-xs font-mono">42.80 SOL</span>
            <span className="text-[10px] text-slate-400 block">30% to Locker</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-tech">Network / Gas</span>
            <span className="font-bold text-emerald-400 text-xs font-mono">99.9%</span>
            <span className="text-[10px] text-slate-400 block">Priority Fee</span>
          </div>
        </div>

        {/* Chart Lipat (Accordion Price Chart) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <button
            onClick={() => setIsChartOpen(!isChartOpen)}
            className="w-full flex justify-between items-center text-xs text-slate-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">📈</span>
              <span className="font-bold text-white text-sm font-tech">$ZQI / USDC</span>
              <span className="text-emerald-400 font-mono text-xs">$0.0500 (+18.4%)</span>
            </div>
            <span className="text-xs text-cyan-400 font-bold">
              {isChartOpen ? 'Hide Chart ▲' : 'Show Chart ▼'}
            </span>
          </button>

          {isChartOpen && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex justify-between items-center mb-2.5 text-xs">
                <span className="text-slate-400">24h Vol: <strong className="text-white font-mono">$42,850 USDC</strong></span>
                <div className="flex gap-1 text-[11px] font-mono">
                  {['15m', '1h', '4h', '1d'].map(tf => (
                    <button
                      key={tf}
                      onClick={() => setChartTf(tf)}
                      className={`px-2 py-1 rounded font-bold ${chartTf === tf ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-48 w-full relative">
                <canvas ref={chartRef} />
              </div>
              <div className="text-[10px] text-slate-500 text-right mt-1.5 font-mono">
                Jito MEV Protected Feed ⚡
              </div>
            </div>
          )}
        </div>

        {/* Form Swap Asli */}
        {activeTab === 'Swap' ? (
          <div className="space-y-3.5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-xl">
              {/* Header Judul + Badge MEV Secure Pill */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-white tracking-wide font-tech">AMM DEX Swap</span>
                <span className="inline-flex items-center gap-1.5 bg-sky-950/80 border border-sky-600/50 text-sky-400 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm font-tech">
                  <span>🛡️</span> <span>MEV SECURE</span>
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Non-custodial peer-to-peer asset swapping via immutable Solana smart contract routing.
              </p>

              <div className="space-y-2.5">
                {/* Box Input You Pay */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
                    <span>You Pay</span>

                    {wallet?.isConnected && (
                      <div className="flex items-center gap-2">
                        <span>
                          Balance: <strong className="text-slate-200 font-mono">
                            {tokenPay === 'ZQI' 
                              ? Number(wallet?.zqiBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) 
                              : (tokenPay === 'USDC' ? '5,000.00' : '10.50')} {tokenPay}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const maxBal = tokenPay === 'ZQI' 
                              ? (wallet?.zqiBalance || 0) 
                              : (tokenPay === 'USDC' ? '5000' : '10.5');
                            if (setPayAmount) setPayAmount(maxBal.toString());
                          }}
                          className="bg-blue-600/30 border border-blue-500/50 text-blue-400 hover:bg-blue-600/50 text-[10px] font-black px-2 py-0.5 rounded transition uppercase font-tech"
                        >
                          MAX
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={payAmount === '0' ? '' : (payAmount ?? '')}
                      disabled={isSwapLoading}
                      onChange={(e) => setPayAmount && setPayAmount(e.target.value)}
                      onBlur={() => { if (payAmount === '' && setPayAmount) setPayAmount('0'); }}
                      className="bg-transparent font-bold text-lg text-white outline-none w-36 font-mono"
                    />
                    <select
                      value={tokenPay || 'USDC'}
                      onChange={(e) => handleTokenChange && handleTokenChange(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-xs font-bold text-white rounded-lg px-2.5 py-1.5 outline-none cursor-pointer font-mono"
                    >
                      {Array.isArray(tokens) ? (
                        tokens.map((t) => (
                          <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                        ))
                      ) : (
                        <>
                          <option value="USDC">USDC</option>
                          <option value="SOL">SOL</option>
                          <option value="ZQI">ZQI</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Tombol Balik Arah Tukar (Reverse) */}
                <div className="flex justify-center -my-1 relative z-10">
                  <button
                    type="button"
                    onClick={switchTokens}
                    disabled={isSwapLoading}
                    className="w-8 h-8 bg-slate-900 border border-slate-700/80 rounded-full flex items-center justify-center text-cyan-400 hover:text-white text-sm active:scale-95 transition shadow-md"
                  >
                    ⇅
                  </button>
                </div>

                {/* Box Output You Receive */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>You Receive (Estimated)</span>
                    <span className="font-mono text-[10px] text-slate-500">Rate synced via Jupiter</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-white font-mono">{receiveAmount}</span>
                    <span className="bg-[#0b1728] border border-cyan-800/60 text-cyan-400 font-extrabold text-xs px-3 py-1.5 rounded-lg font-mono tracking-wider">
                      {tokenReceive}
                    </span>
                  </div>
                </div>

                {/* Rincian Fee & Status Anti-Wash Trading */}
                <div className="space-y-1.5 pt-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Trading Fee (0.3%):</span>
                    <span className="font-mono text-slate-200 font-bold">{swapFee} {tokenPay}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 border-t border-slate-800/80 pt-1.5">
                    <span>Anti-Wash Trading Check:</span>
                    <span className="text-emerald-400 font-bold">Active (Daily)</span>
                  </div>
                </div>

                {/* Tombol Aksi Swap */}
                <button
                  type="button"
                  onClick={wallet?.isConnected ? onLaunchSwap : onConnectWallet}
                  disabled={wallet?.isConnected && (!payAmount || parseFloat(payAmount) <= 0 || isSwapLoading)}
                  className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:opacity-95 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg active:scale-95 transition mt-2 font-tech tracking-wide"
                >
                  {isSwapLoading 
                    ? 'Processing Secure Swap...' 
                    : !wallet?.isConnected 
                      ? 'Connect Wallet' 
                      : (!payAmount || parseFloat(payAmount) <= 0) 
                        ? 'Enter an Amount' 
                        : 'Swap via Jito Private Bundle'}
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'Lock' ? (
          /* Form Lock & Yield */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-xl">
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-white font-tech">ZQI Lock & Yield</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lock your $ZQI tokens to claim Real Yield paid out in stable USDC. Early unlock incurs a 10% penalty.
              </p>
            </div>

            {/* Toggle Tabs: Instant Lock vs Boosted Lock */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-bold font-mono">
              <button
                type="button"
                onClick={() => switchLockCalculationView && switchLockCalculationView('manual')}
                className={`py-2 rounded-lg transition ${
                  lockCalculationMode === 'manual'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Instant Lock
              </button>
              <button
                type="button"
                onClick={() => switchLockCalculationView && switchLockCalculationView('wizard')}
                className={`py-2 rounded-lg transition ${
                  lockCalculationMode === 'wizard'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Boosted Lock
              </button>
            </div>

            {/* Row TVL & Saldo */}
            <div className="flex justify-between items-center text-xs font-mono px-0.5">
              <span className="text-slate-400">
                Protocol TVL: <strong className="text-white">${(protocolTVL || 1266678).toLocaleString('en-US')}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">
                  Your Balance: <strong className="text-white">{(wallet?.zqiBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ZQI</strong>
                </span>
                {wallet?.isConnected && (wallet?.zqiBalance || 0) > 0 && !isTokenLocked && (
                  <button
                    type="button"
                    onClick={() => setLockAmount && setLockAmount(wallet.zqiBalance.toString())}
                    className="bg-blue-600/30 border border-blue-500/50 text-blue-400 hover:bg-blue-600/50 text-[10px] font-black px-1.5 py-0.5 rounded transition uppercase font-tech"
                  >
                    MAX
                  </button>
                )}
              </div>
            </div>

            {/* Input Nominal Lock */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">
                {lockCalculationMode === 'manual' ? 'Amount of $ZQI to Lock:' : 'Enter Capital For Prediction:'}
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <input
                  type="number"
                  placeholder="0.0"
                  value={lockAmount === '0' ? '' : lockAmount}
                  disabled={isTokenLocked || isLockLoading}
                  onChange={(e) => setLockAmount && setLockAmount(e.target.value)}
                  onBlur={() => { if (lockAmount === '') setLockAmount && setLockAmount('0'); }}
                  className="bg-transparent font-bold text-lg text-white outline-none w-full font-mono"
                />
              </div>
            </div>

            {/* Pilihan Durasi */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium block">
                Select Lock Duration:
              </label>
              {lockCalculationMode === 'manual' ? (
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  {[
                    { days: 7, label: '7 Days (0.5x)' },
                    { days: 15, label: '15 Days (0.75x)' },
                    { days: 30, label: '30 Days (1.0x)' }
                  ].map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      disabled={isTokenLocked}
                      onClick={() => setInstantDays && setInstantDays(item.days)}
                      className={`py-2.5 rounded-xl border text-xs font-mono transition ${
                        instantDays === item.days
                          ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  {[
                    { mult: 1, label: '30 Days (1x)' },
                    { mult: 1.5, label: '90 Days (1.5x)' },
                    { mult: 2.5, label: '180 Days (2.5x)' }
                  ].map((item) => (
                    <button
                      key={item.mult}
                      type="button"
                      disabled={isTokenLocked}
                      onClick={() => setChosenMultiplier && setChosenMultiplier(item.mult)}
                      className={`py-2.5 rounded-xl border text-xs font-mono transition ${
                        chosenMultiplier === item.mult
                          ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Processing Share Box */}
            <div className="p-3 bg-slate-950 border border-emerald-900/40 rounded-xl flex justify-between items-center text-xs">
              <span className="text-slate-300">
                {lockCalculationMode === 'manual' ? 'Base Processing Share:' : 'Boosted Yield Score:'}
              </span>
              <span className="font-bold font-mono text-emerald-400 text-sm">
                {liveScore || '0 ZQI Share'}
              </span>
            </div>

            {/* Badge Reward Info */}
            <div className="p-2.5 bg-[#0a1829] border border-cyan-800/50 rounded-xl text-center space-y-0.5">
              <span className="text-cyan-400 font-bold text-xs block font-tech">
                Reward: Real USDC (Demo Sandbox Epoch)
              </span>
              {estimatedRewardText && (
                <span className="text-[11px] text-slate-400 block font-mono">
                  {estimatedRewardText}
                </span>
              )}
            </div>

            {/* Row Klaim Hadiah Saat Terkunci */}
            {isTokenLocked && showRewardRow && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  Yield Earned: <strong className="text-emerald-400 font-mono text-sm">{earnedUsdcDisplay || '0.00 USDC'}</strong>
                </span>
                <button
                  type="button"
                  onClick={claimZqiReward}
                  disabled={!rewardClaimable}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                    rewardClaimable
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-amber-950/40 border border-amber-800/50 text-amber-400 cursor-not-allowed'
                  }`}
                >
                  {rewardClaimable ? 'Claim Reward' : `🔒 Accumulating (${lockCountdown}s)`}
                </button>
              </div>
            )}

            {/* Tombol Aksi Utama Dinamis */}
            {wallet?.isConnected && (wallet?.zqiBalance || 0) <= 0 && !isTokenLocked ? (
              <button
                type="button"
                onClick={() => {
                  if (onGoToSwap) onGoToSwap();
                  setActiveTab('Swap');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg active:scale-95 transition font-tech"
              >
                ⚡ Insufficient $ZQI — Swap Now →
              </button>
            ) : (
              <button
                type="button"
                onClick={wallet?.isConnected ? onLockToken : onConnectWallet}
                disabled={isTokenLocked || (wallet?.isConnected && (!lockAmount || parseFloat(lockAmount) <= 0 || isLockLoading))}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg active:scale-95 transition font-tech"
              >
                {isLockLoading 
                  ? 'Processing Lock...' 
                  : isTokenLocked 
                    ? '✓ Token Locked' 
                    : !wallet?.isConnected 
                      ? 'Connect Wallet' 
                      : (!lockAmount || parseFloat(lockAmount) <= 0) 
                        ? 'Enter an Amount' 
                        : 'Lock Token'}
              </button>
            )}

            {/* Tombol Emergency Early Unlock */}
            <button
              type="button"
              onClick={triggerEmergencyModal}
              disabled={!isTokenLocked || isLockLoading}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition font-tech ${
                isTokenLocked && !isLockLoading
                  ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white shadow-lg active:scale-95'
                  : 'bg-slate-950 border-red-950/60 text-red-400/60 cursor-not-allowed'
              }`}
            >
              <span>⚠️</span> <span>Emergency Early Unlock (10% Penalty)</span>
            </button>
          </div>
        ) : activeTab === 'Vault' ? (
          /* KARTU VAULT (YIELD OPTIMIZER) */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-extrabold text-white font-tech">Yield Optimizer</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deposit once, the system automatically executes periodic auto-compounding optimization.
              </p>
            </div>

            {/* Boosted APY Pill */}
            <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl py-2.5 text-center">
              <span className="text-cyan-400 font-bold text-sm tracking-wide font-tech">
                Boosted APY: Up to 49.1%
              </span>
            </div>

            {/* Metrics Box (TVL & Active Users) */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 grid grid-cols-2 text-center divide-x divide-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-tech uppercase">Global Vault TVL:</span>
                <span className="text-emerald-400 font-bold text-sm font-mono">$739,950</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-tech uppercase">Active Depositors:</span>
                <span className="text-white font-bold text-sm font-mono">1,842 Users</span>
              </div>
            </div>

            {/* Calculator Subcard */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 space-y-3">
              <h3 className="text-cyan-400 font-bold text-xs font-tech">ZoniqFi Yield Calculator</h3>
              
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 block">Allocation Amount (USDC):</label>
                <input
                  type="number"
                  placeholder="0.0"
                  value={vaultAmount}
                  onChange={(e) => setVaultAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-base outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-slate-300">
                  <span>Daily Rate:</span>
                  <strong className="text-white font-mono">0.11%</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Est. Profit / Day:</span>
                  <span className="text-emerald-400 font-mono font-bold">{estDaily} USDC</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Est. Profit / Month:</span>
                  <span className="text-emerald-400 font-mono font-bold">{estMonthly} USDC</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Est. Profit / Year:</span>
                  <span className="text-emerald-400 font-mono font-bold">{estYearly} USDC</span>
                </div>
              </div>
            </div>

            {/* Tombol Aksi Deposit */}
            <button
              type="button"
              disabled={numVault <= 0}
              onClick={() => {
                if (onVaultDeposit) {
                  onVaultDeposit(numVault);
                } else {
                  showToast(`Successfully deposited ${vaultAmount} USDC into Vault!`);
                }
              }}
              className="w-full py-3 rounded-xl text-sm font-bold transition disabled:bg-slate-800/80 disabled:text-slate-500 disabled:cursor-not-allowed bg-cyan-600 hover:bg-cyan-500 text-white active:scale-95 shadow-lg font-tech"
            >
              {numVault <= 0 ? 'Enter an Amount' : `Deposit ${vaultAmount} USDC`}
            </button>
          </div>
        ) : activeTab === 'Affiliate' ? (
          <MobileAffiliateTab
            wallet={wallet}
            onConnectWallet={onConnectWallet}
            referrerInput={referrerInput}
            setReferrerInput={setReferrerInput}
            referralVolume={referralVolume}
            referralEarned={referralEarned}
            tierLabel={tierLabel}
            tierColor={tierColor}
            onCopyLink={onCopyLink}
            onVerifyReferral={onVerifyReferral}
            currentDomain={currentDomain}
          />
        ) : activeTab === 'PayFi' ? (
          <div className="w-full pb-6">
            <PayFiGateway
              isMobile={true}
              wallet={wallet}
              onConnectWallet={onConnectWallet}
              PROGRAM_ID={PROGRAM_ID}
              solPriceUsd={solPriceUsd}
            />
          </div>
        ) : null}

        {/* Atomic Settlement Routing Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
          <button
            onClick={() => setIsAtomicOpen(!isAtomicOpen)}
            className="w-full flex justify-between items-center text-xs"
          >
            <span className="font-bold text-cyan-400 flex items-center gap-2 font-tech">
              <span className="text-amber-400 text-sm">⚡</span> <span>Recent Atomic Settlement Routing</span>
            </span>
            <span className="text-xs text-slate-400 font-bold">{isAtomicOpen ? 'Hide ▲' : 'View ▼'}</span>
          </button>

          {isAtomicOpen && (
            <div className="space-y-2 pt-2.5 border-t border-slate-800 text-xs">
              {/* 1. QRIS Settlement */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-xs">QRIS Settlement: #RELAY-SOL-02</div>
                  <div className="text-[10px] text-slate-500">Gas Tank Relayer → 4 Pools Split</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-xs">0.00075 SOL (5%)</span>
              </div>

              {/* 2. AMM Swap */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-xs">AMM Swap: USDC → $ZQI</div>
                  <div className="text-[10px] text-slate-500">Jito MEV Protected Bundle</div>
                </div>
                <span className="font-mono text-cyan-400 font-bold text-xs">0.00300 SOL (0.3%)</span>
              </div>

              {/* 3. Yield Vault */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-xs">Yield Vault Auto-Compound</div>
                  <div className="text-[10px] text-slate-500">Epoch Rebalancing Executed</div>
                </div>
                <span className="font-mono text-purple-400 font-bold text-xs">+49.1% APY Boost</span>
              </div>

              {/* 4. Liquidity Locker */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-xs">Liquidity Locker: #LP-LOCK</div>
                  <div className="text-[10px] text-slate-500">Protocol-Owned Liquidity (POL)</div>
                </div>
                <span className="font-mono text-amber-400 font-bold text-xs">100% On-Chain</span>
              </div>
            </div>
          )}
        </div>

        {/* TOAST POPUP */}
        {toastMsg && (
          <div className="fixed bottom-20 left-4 right-4 p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-xs text-emerald-200 flex items-center justify-between shadow-2xl z-50">
            <span>✅ {toastMsg}</span>
            <button onClick={() => setToastMsg(null)} className="text-emerald-400 font-bold px-2">✕</button>
          </div>
        )}
      </main>

      {/* 5. BOTTOM NAVIGATION BAR (Skala Baru: h-16 + Ikon Lebih Besar) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex justify-around items-center px-3 z-40">
        {[
          { id: 'Swap', icon: '🔄' },
          { id: 'Lock', icon: '🔒' },
          { id: 'Vault', icon: '📊' },
          { id: 'Affiliate', icon: '🤝' },
          { id: 'PayFi', icon: '🛍️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold transition font-tech ${
              activeTab === tab.id ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.id}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}