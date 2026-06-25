import React from 'react';

const DistributionLog = ({ programId = "HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD", swapData }) => {
  // Fungsi untuk memotong Program ID agar rapi di HP
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  // Data tiruan berdasarkan image_c21b16.png jika data dinamis belum dioper
  const data = swapData || {
    fromAmount: "5 USDC",
    toAmount: "0.0294 SOL",
    totalFee: "0.0150 USDC",
    breakdown: [
      { label: "Yield Optimizer Vault (40%)", amount: "0.00600 USDC", icon: "fa-vault" },
      { label: "Liquidity Provision Pool (30%)", amount: "0.00450 USDC", icon: "fa-chart-pie" },
      { label: "Affiliate Treasury (15%)", amount: "0.00225 USDC", icon: "fa-users" },
      { label: "Dev & Infrastructure (15%)", amount: "0.00225 USDC", icon: "fa-server" },
    ]
  };

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
      
      {/* HEADER: STATUS & PROGRAM ID */}
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #1f2937', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-circle-check" style={{ color: '#10b981', fontSize: '1.2rem' }}></i>
          <span style={{ fontWeight: '700', color: '#10b981', letterSpacing: '0.5px', fontSize: '0.95rem' }}>SWAP SUCCESSFUL</span>
        </div>
        <div style={{ marginLeft: 'auto', background: '#1f2937', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#94a3b8' }}>
          <i className="fas fa-code" style={{ marginRight: '6px', color: '#14b8a6' }}></i>
          Program: <span style={{ fontFamily: 'monospace', color: '#fff' }} title={programId}>{formatAddress(programId)}</span>
        </div>
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
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(20, 184, 166, 0.1)', display: 'flex', alignItems: 'center', justifyInlines: 'center', justifyContent: 'center' }}>
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