import React, { useEffect } from 'react';

// Fallback data jika breakdown spesifik belum terkirim dari contract/handler
const defaultSwapBreakdown = [
  { label: "Yield Optimizer Vault (40%)", amount: "0.02400 USDC", icon: "🏛️" },
  { label: "ZQI Real Yield Pool (30%)", amount: "0.01800 USDC", icon: "📈" },
  { label: "Affiliate Treasury (15%)", amount: "0.00900 USDC", icon: "👥" },
  { label: "Project Treasury Operations (15%)", amount: "0.00900 USDC", icon: "⚙️" },
];

const defaultPayFiBreakdown = [
  { label: "Yield Optimizer Vault (40%)", amount: "0.00030 SOL", icon: "🏛️" },
  { label: "ZQI Real Yield Pool (30%)", amount: "0.00022 SOL", icon: "📈" },
  { label: "Affiliate Treasury (15%)", amount: "0.00011 SOL", icon: "👥" },
  { label: "Project Treasury Operations (15%)", amount: "0.00011 SOL", icon: "⚙️" },
];

const TransactionSuccessModal = ({ 
  isOpen, 
  onClose, 
  swapDetails = null,
  payfiDetails = null,
  programId = "HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD",
  onNavigateTab
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPayFi = Boolean(payfiDetails);

  // Normalisasi Data Ringkas (Swap vs PayFi)
  const data = isPayFi ? {
    title: "License Issued Successfully",
    item: payfiDetails?.productName || "Next.js PayFi Storefront Template",
    nftTokenId: payfiDetails?.nftTokenId || "#SOL-8322",
    gateway: payfiDetails?.gateway?.includes("QRIS") ? "QRIS Instant" : "Solana Devnet",
    feeAmount: payfiDetails?.feeAmount || "0.00075 SOL",
    feeLabel: "ON-CHAIN FEE DISTRIBUTION (5%)",
    downloadUrl: payfiDetails?.downloadUrl || null,
    txSignature: payfiDetails?.txSignature || null,
    breakdown: payfiDetails?.breakdown || defaultPayFiBreakdown
  } : {
    title: "Swap Executed Successfully",
    fromAmount: swapDetails?.fromAmount || "20 USDC",
    toAmount: swapDetails?.toAmount || "39.8800 ZQI",
    feeAmount: swapDetails?.feeAmount || "0.0600 USDC",
    feeLabel: "ON-CHAIN FEE DISTRIBUTION (0.3%)",
    txSignature: swapDetails?.txSignature || null,
    breakdown: swapDetails?.breakdown || defaultSwapBreakdown
  };

  const formatShortAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 5)}...${addr.slice(-5)}`;
  };

  const isTx = Boolean(data.txSignature);
  const explorerUrl = isTx 
    ? `https://solscan.io/tx/${data.txSignature}?cluster=devnet`
    : `https://solscan.io/account/${programId}?cluster=devnet`;

  const isReceivedZQI = !isPayFi && (swapDetails?.toAmount?.includes("ZQI") || swapDetails?.tokenReceive === "ZQI");
  const isReceivedUSDC = !isPayFi && (swapDetails?.toAmount?.includes("USDC") || swapDetails?.tokenReceive === "USDC");

  const handleActionClick = () => {
    if (isPayFi) {
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
      }
      onClose?.();
      return;
    }

    if (onNavigateTab) {
      if (isReceivedZQI) {
        onNavigateTab('staking');
      } else if (isReceivedUSDC) {
        onNavigateTab('vault');
      }
    }
    onClose?.();
  };

  return (
    <div 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
        backgroundColor: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '16px 12px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          margin: 'auto',
          backgroundColor: '#090d16',
          border: '1px solid #1e293b',
          maxWidth: '380px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          borderRadius: '16px',
          padding: '14px 14px 12px',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(16, 185, 129, 0.1)',
          color: '#ffffff',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          boxSizing: 'border-box',
          textAlign: 'left',
          position: 'relative'
        }}
      >
        {/* Tombol Tutup X */}
        <button 
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#94a3b8',
            fontSize: '0.85rem',
            cursor: 'pointer',
            lineHeight: 1,
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        {/* 1. HEADER MODAL (Ringkas) */}
        <div style={{ textAlign: 'center', marginBottom: '10px', paddingRight: '20px', paddingLeft: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>🎉</span>
            <h3 style={{ 
              margin: 0, 
              fontWeight: 800, 
              color: isPayFi ? '#34d399' : '#10b981', 
              fontSize: '1rem',
              letterSpacing: '0.2px'
            }}>
              {data.title}
            </h3>
          </div>
          <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
            {isPayFi 
              ? "Cryptographic license verified & delivered on-chain."
              : "Atomic swap executed with automated multi-pool fee split."}
          </p>
        </div>

        {/* 2. RINGKASAN TRANSAKSI (Sama-sama 2 Baris + Tx Hash) */}
        <div style={{
          background: '#040711',
          border: '1px solid #162032',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '0.78rem'
        }}>
          {isPayFi ? (
            <>
              {/* Baris 1: Produk & Token ID Badge dalam 1 baris */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#94a3b8', flexShrink: 0 }}>Item / NFT:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                  <span style={{ 
                    color: '#ffffff', 
                    fontWeight: 700, 
                    fontSize: '0.78rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '145px'
                  }}>
                    {data.item}
                  </span>
                  <span style={{ 
                    color: '#38bdf8', 
                    fontWeight: 700, 
                    fontFamily: 'monospace', 
                    fontSize: '0.68rem',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}>
                    {data.nftTokenId}
                  </span>
                </div>
              </div>

              {/* Baris 2: Gateway & Fee dalam 1 baris */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Route & Fee (5%):</span>
                <span style={{ color: '#e2e8f0', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.76rem' }}>
                  <strong style={{ color: '#38bdf8' }}>{data.gateway}</strong> • {data.feeAmount}
                </span>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Exchanged:</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.82rem' }}>
                  {data.fromAmount} <span style={{ color: '#10b981', margin: '0 2px' }}>➔</span> <span style={{ color: '#38bdf8' }}>{data.toAmount}</span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Fee (0.3%):</span>
                <span style={{ color: '#e2e8f0', fontWeight: 700, fontFamily: 'monospace' }}>{data.feeAmount}</span>
              </div>
            </>
          )}

          {/* Baris Solscan Hash */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderTop: '1px solid #162032', 
            paddingTop: '6px', 
            marginTop: '1px',
            fontSize: '0.74rem' 
          }}>
            <span style={{ color: '#94a3b8' }}>Tx Signature:</span>
            <a 
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'monospace',
                color: '#38bdf8',
                fontWeight: 700,
                textDecoration: 'none',
                background: 'rgba(56, 189, 248, 0.08)',
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontSize: '0.72rem'
              }}
            >
              {isTx ? formatShortAddress(data.txSignature) : formatShortAddress(programId)} ↗
            </a>
          </div>
        </div>

        {/* 3. KOTAK PEMBAGIAN FEE ON-CHAIN (4 POOLS) */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            fontSize: '0.68rem', 
            fontWeight: 800, 
            color: '#38bdf8', 
            letterSpacing: '0.4px',
            marginBottom: '4px'
          }}>
            <span>🔗</span>
            <span>{data.feeLabel}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {data.breakdown.map((pool, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#040711',
                  border: '1px solid #162032',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.72rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem' }}>{pool.icon}</span>
                  <span style={{ color: '#94a3b8' }}>{pool.label}</span>
                </div>
                <span style={{ 
                  color: idx === 1 ? '#34d399' : '#38bdf8', 
                  fontWeight: 700, 
                  fontFamily: 'monospace' 
                }}>
                  {pool.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. TOMBOL AKSI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            type="button"
            onClick={handleActionClick}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              background: isPayFi 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : isReceivedZQI 
                ? 'linear-gradient(135deg, #10b981, #059669)' 
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {isPayFi 
              ? (data.downloadUrl ? "📥 Download License (.ZIP)" : "Done")
              : isReceivedZQI 
              ? "Stake $ZQI (Real Yield) →" 
              : isReceivedUSDC 
              ? "Deposit to Vault →" 
              : "Done"}
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              backgroundColor: '#0d131f',
              border: '1px solid #1e293b',
              color: '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default TransactionSuccessModal;