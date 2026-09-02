import React from 'react';

const defaultBreakdown = [
  { label: "Yield Optimizer Vault (40%)", amount: "0.02400 USDC", icon: "fa-vault" },
  { label: "ZQI Real Yield Pool (30%)", amount: "0.01800 USDC", icon: "fa-chart-pie" },
  { label: "Affiliate Treasury (15%)", amount: "0.00900 USDC", icon: "fa-users" },
  { label: "Project Treasury Operations (15%)", amount: "0.00900 USDC", icon: "fa-server" },
];

const DistributionLog = ({ programId = "HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD", swapData }) => {
  const formatAddress = (addr) => {
    if (!addr) return "";
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  // Penggabungan props yang aman agar tidak crash jika swapData parsial
  const data = {
    fromAmount: swapData?.fromAmount || "20 USDC",
    toAmount: swapData?.toAmount || "40.0000 ZQI",
    totalFee: swapData?.totalFee || "0.0600 USDC",
    txSignature: swapData?.txSignature || null,
    breakdown: swapData?.breakdown || defaultBreakdown
  };

  // Prioritaskan link transaksi jika hash tersedia, fallback ke program account
  const solscanUrl = data.txSignature
    ? `https://solscan.io/tx/${data.txSignature}?cluster=devnet`
    : `https://solscan.io/account/${programId}?cluster=devnet`;

  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(20, 184, 166, 0.2)',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '480px',
      margin: '20px auto',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
      fontFamily: "'Inter', sans-serif",
      color: '#f3f4f6',
      textAlign: 'left'
    }}>
      
      {/* HEADER: STATUS, TX V1 BADGE & PROGRAM LINK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #1f2937', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-circle-check" style={{ color: '#10b981', fontSize: '1.1rem' }}></i>
          <span style={{ fontWeight: '700', color: '#10b981', letterSpacing: '0.5px', fontSize: '0.9rem' }}>SWAP SUCCESSFUL</span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Tx v1</span>
        </div>
        
        {/* Solscan Clickable Link */}
        <a 
          href={solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            background: '#1f2937', 
            padding: '4px 10px', 
            borderRadius: '6px', 
            fontSize: '0.78rem', 
            color: '#94a3b8',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            border: '1px solid #334155'
          }}
        >
          <i className="fas fa-code" style={{ color: '#14b8a6' }}></i>
          <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{formatAddress(data.txSignature || programId)}</span>
          <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: '0.65rem', color: '#64748b' }}></i>
        </a>
      </div>

      {/* SWAP DETAILS */}
      <div style={{ marginBottom: '20px', background: 'rgba(11, 15, 25, 0.5)', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1f2937' }}>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>Transaction Pair</div>
        <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#fff' }}>
          {data.fromAmount} <i className="fas fa-arrow-right" style={{ fontSize: '0.9rem', margin: '0 8px', color: '#3b82f6' }}></i> {data.toAmount}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.85rem', color: '#94a3b8', paddingTop: '8px', borderTop: '1px solid rgba(31, 41, 55, 0.5)' }}>
          <span>Protocol Fee (0.3%)</span>
          <span style={{ fontWeight: '600', color: '#fff' }}>{data.totalFee}</span>
        </div>
      </div>

      {/* DISTRIBUTION LOG BREAKDOWN */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          <i className="fas fa-network-wired" style={{ marginRight: '6px' }}></i> On-Chain Fee Distribution
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.breakdown.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.03)',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(20, 184, 166, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fas ${item.icon}`} style={{ color: '#14b8a6', fontSize: '0.85rem' }}></i>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{item.label}</span>
              </div>
              <span style={{ fontWeight: '600', fontFamily: 'monospace', color: '#fff', fontSize: '0.85rem' }}>{item.amount}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DistributionLog;