import React from 'react';

const TransactionSuccessModal = ({ 
  isOpen, 
  onClose, 
  swapDetails = null,
  programId = "HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD"
}) => {
  if (!isOpen) return null;

  const data = swapDetails || {
    fromAmount: "20 USDC",
    toAmount: "40.0000 ZQI",
    feeAmount: "0.0600 USDC"
  };

  const formatShortAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#0b121f',
        border: '1px solid #1e293b',
        maxWidth: '440px',
        width: '100%',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
        textAlign: 'left'
      }}>
        
        {/* Header Modal */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '14px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🎉</span>
            <span style={{ fontWeight: '800', color: '#10b981', fontSize: '1rem', letterSpacing: '0.5px' }}>
              Swap Successful!
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.4rem',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Info Box Sandbox */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '16px',
          fontSize: '0.82rem',
          color: '#93c5fd'
        }}>
          <div style={{ fontWeight: '700', color: '#60a5fa', marginBottom: '2px' }}>
            ⚡ Solana Devnet Sandbox
          </div>
          <div>Protocol Fee settled safely into on-chain distribution pools.</div>
        </div>

        {/* Ringkasan Transaksi */}
        <div style={{
          background: '#070a13',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span>Exchanged:</span>
            <span style={{ color: '#ffffff', fontWeight: '700' }}>{data.fromAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span>Received:</span>
            <span style={{ color: '#38bdf8', fontWeight: '700' }}>{data.toAmount}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            color: '#94a3b8', 
            borderTop: '1px solid #1e293b', 
            paddingTop: '8px',
            fontSize: '0.8rem'
          }}>
            <span>Program ID:</span>
            <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>
              {formatShortAddress(programId)}
            </span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <a
            href={`https://solscan.io/account/${programId}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              textDecoration: 'none',
              textAlign: 'center',
              padding: '11px 0',
              borderRadius: '8px',
              fontSize: '0.85rem',
              backgroundColor: '#111827',
              border: '1px solid #1e293b',
              color: '#38bdf8',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            Solscan ↗
          </a>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px 0',
              borderRadius: '8px',
              fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default TransactionSuccessModal;