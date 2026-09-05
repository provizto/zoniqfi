import React from 'react';

const defaultBreakdown = [
  { label: "Yield Optimizer Vault (40%)", amount: "0.02400 USDC", icon: "fa-vault" },
  { label: "ZQI Real Yield Pool (30%)", amount: "0.01800 USDC", icon: "fa-chart-pie" },
  { label: "Affiliate Treasury (15%)", amount: "0.00900 USDC", icon: "fa-users" },
  { label: "Project Treasury Operations (15%)", amount: "0.00900 USDC", icon: "fa-server" },
];

const DistributionLog = ({ 
  programId = "HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD", 
  swapData,
  cluster = "devnet" 
}) => {
  const formatAddress = (addr) => {
    if (!addr) return "";
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const isTx = Boolean(swapData?.txSignature);
  const activeIdentifier = swapData?.txSignature || programId;

  const solscanUrl = isTx
    ? `https://solscan.io/tx/${swapData.txSignature}?cluster=${cluster}`
    : `https://solscan.io/account/${programId}?cluster=${cluster}`;

  const data = {
    fromAmount: swapData?.fromAmount || "20 USDC",
    toAmount: swapData?.toAmount || "40.0000 ZQI",
    totalFee: swapData?.totalFee || "0.0600 USDC",
    breakdown: swapData?.breakdown || defaultBreakdown
  };

  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(20, 184, 166, 0.25)',
      borderRadius: '16px',
      padding: '20px 24px',
      maxWidth: '480px',
      margin: '20px auto',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: '#f3f4f6',
      textAlign: 'left'
    }}>
      
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px', 
        borderBottom: '1px solid #1f2937', 
        paddingBottom: '12px', 
        flexWrap: 'wrap', 
        gap: '8px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-circle-check" style={{ color: '#10b981', fontSize: '1rem' }}></i>
          <span style={{ fontWeight: '700', color: '#10b981', letterSpacing: '0.5px', fontSize: '0.85rem' }}>
            SWAP SUCCESSFUL
          </span>
          <span style={{ 
            fontSize: '0.68rem', 
            background: 'rgba(56, 189, 248, 0.15)', 
            color: '#38bdf8', 
            padding: '2px 6px', 
            borderRadius: '4px', 
            fontWeight: '600', 
            border: '1px solid rgba(56, 189, 248, 0.3)' 
          }}>
            Tx v1
          </span>
        </div>
        
        {/* Solscan Explorer Button */}
        <a 
          href={solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Lihat ${isTx ? 'Transaksi' : 'Program'} di Solscan`}
          style={{ 
            background: '#1f2937', 
            padding: '5px 10px', 
            borderRadius: '6px', 
            fontSize: '0.75rem', 
            color: '#94a3b8', 
            textDecoration: 'none', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            border: '1px solid #334155'
          }}
        >
          <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{isTx ? 'Tx:' : 'Prog:'}</span>
          <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: '500' }}>
            {formatAddress(activeIdentifier)}
          </span>
          <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: '0.65rem', color: '#64748b' }}></i>
        </a>
      </div>

      {/* SWAP DETAILS */}
      <div style={{ 
        marginBottom: '18px', 
        background: 'rgba(11, 15, 25, 0.55)', 
        padding: '12px 16px', 
        borderRadius: '10px', 
        border: '1px solid #1f2937' 
      }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Transaction Pair</div>
        <div style={{ fontWeight: '600', fontSize: '1.05rem', color: '#fff', display: 'flex', alignItems: 'center' }}>
          <span>{data.fromAmount}</span>
          <i className="fas fa-arrow-right" style={{ fontSize: '0.85rem', margin: '0 10px', color: '#38bdf8' }}></i>
          <span>{data.toAmount}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '10px', 
          fontSize: '0.82rem', 
          color: '#94a3b8', 
          paddingTop: '8px', 
          borderTop: '1px solid rgba(31, 41, 55, 0.6)' 
        }}>
          <span>Protocol Fee (0.3%)</span>
          <span style={{ fontWeight: '600', color: '#e2e8f0', fontFamily: 'monospace' }}>{data.totalFee}</span>
        </div>
      </div>

      {/* FEE BREAKDOWN */}
      <div>
        <div style={{ 
          fontSize: '0.75rem', 
          fontWeight: '700', 
          color: '#14b8a6', 
          textTransform: 'uppercase', 
          letterSpacing: '0.8px', 
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <i className="fas fa-network-wired"></i>
          <span>On-Chain Fee Distribution</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.breakdown.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '26px', 
                  height: '26px', 
                  borderRadius: '6px', 
                  background: 'rgba(20, 184, 166, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className={`fas ${item.icon}`} style={{ color: '#14b8a6', fontSize: '0.75rem' }}></i>
                </div>
                <span style={{ color: '#94a3b8' }}>{item.label}</span>
              </div>
              <span style={{ fontWeight: '600', fontFamily: 'monospace', color: '#f1f5f9' }}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DistributionLog;