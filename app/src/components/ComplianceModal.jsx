import React, { useEffect } from 'react';

const ComplianceModal = ({ isOpen = true, onClose, onAccept }) => {
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

  const handleAccept = () => {
    localStorage.setItem('zoniq_terms_accepted', 'true');
    if (onAccept) onAccept();
  };

  const handleDecline = (e) => {
    e.preventDefault();
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(10px)',
        padding: '20px'
      }}
    >
      <div style={{
        backgroundColor: '#0b1326',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        maxWidth: '560px',
        width: '100%',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 25px rgba(20, 241, 149, 0.08)',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* MODAL TITLE */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '12px',
          marginBottom: '16px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', color: '#14F195' }}>🛡️</span>
            <h2 style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: '800',
              color: '#14F195',
              letterSpacing: '0.04em'
            }}>
              ZONIQFI | TERMS & REGULATORY COMPLIANCE
            </h2>
          </div>
          <span style={{
            fontSize: '0.7rem',
            background: 'rgba(20, 241, 149, 0.15)',
            color: '#14F195',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: '700',
            border: '1px solid rgba(20, 241, 149, 0.3)'
          }}>
            PayFi v1.0
          </span>
        </div>
        
        {/* SCROLL AREA */}
        <div style={{
          fontSize: '0.84rem',
          color: '#94a3b8',
          lineHeight: '1.6',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '300px',
          overflowY: 'auto',
          paddingRight: '8px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#334155 #0b1326'
        }}>
          <p style={{ margin: 0, color: '#e2e8f0' }}>
            By clicking <strong>"I Agree & Enter App"</strong>, you explicitly acknowledge that you are accessing the official infrastructure sandbox for the <strong>ZoniqFi PayFi & DeFi Protocol</strong>.
          </p>
          
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.78rem'
          }}>
            <p style={{ color: '#fbbf24', fontWeight: 'bold', margin: '0 0 4px 0' }}>
              ⚠️ SOLANA DEVNET & HYBRID SETTLEMENT NOTICE:
            </p>
            <p style={{ margin: 0, color: '#fde68a' }}>
              DeFi transactions and on-chain program validations run under simulated Solana Devnet parameters. PayFi merchant checkouts integrate decentralized escrow and dynamic QRIS payment endpoints without middleman custody.
            </p>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 12px' }}>
            <strong style={{ color: '#38bdf8', fontSize: '0.8rem' }}>1. Non-Custodial Architecture:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
              ZoniqFi never holds or has custody of your private cryptographic keys. All transactions (Swaps, Locks, and PayFi Checkouts) are signed locally by your client wallet (Phantom, Solflare, OKX, etc.).
            </p>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 12px' }}>
            <strong style={{ color: '#fbbf24', fontSize: '0.8rem' }}>2. PayFi Merchant Gateway & Escrow Terms:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
              Payments for goods and digital assets route 95% directly to the designated vendor payout wallet while 5% protocol cut is allocated to platform reserves and Real Yield token pools. Physical goods shipping and RWA fulfillment remain the sole responsibility of individual registered merchants.
            </p>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 12px' }}>
            <strong style={{ color: '#c084fc', fontSize: '0.8rem' }}>3. Anti-MEV & Anti-Sybil Defense:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
              AMM swaps utilize Jito Block Engine private bundle routing to prevent front-running and sandwich attacks. Referral links and SNS domains enforce an on-chain 10-second cooldown to eliminate automated bot farming.
            </p>
          </div>
          
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 12px' }}>
            <strong style={{ color: '#4ade80', fontSize: '0.8rem' }}>4. Jurisdictional & Compliance Restrictions:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
              Access to this protocol is strictly restricted for residents or citizens of prohibited jurisdictions subject to international sanctions (including US, IR, KP). Automated edge geoblocking is continuously enforced.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '12px',
          width: '100%',
          flexShrink: 0
        }}>
          <button 
            type="button"
            onClick={handleDecline}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '11px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: '#111827',
              border: '1px solid #334155',
              color: '#94a3b8',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Decline & Exit
          </button>
          
          <button 
            type="button"
            onClick={handleAccept}
            style={{
              flex: 1.2,
              padding: '11px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: '#14F195',
              border: 'none',
              color: '#030712',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(20, 241, 149, 0.35)'
            }}
          >
            I Agree & Enter App →
          </button>
        </div>

      </div>
    </div>
  );
};

export default ComplianceModal;