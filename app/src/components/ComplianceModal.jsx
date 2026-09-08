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
        maxWidth: '580px',
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
              fontSize: '1.05rem',
              fontWeight: '800',
              color: '#14F195',
              letterSpacing: '0.04em'
            }}>
              ZONIQFI | ACCELERATOR EVALUATION & TERMS
            </h2>
          </div>
          <span style={{
            fontSize: '0.68rem',
            background: 'rgba(20, 241, 149, 0.15)',
            color: '#14F195',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: '700',
            border: '1px solid rgba(20, 241, 149, 0.3)'
          }}>
            Colosseum Sprint Devnet
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
          maxHeight: '320px',
          overflowY: 'auto',
          paddingRight: '8px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#334155 #0b1326'
        }}>
          <p style={{ margin: 0, color: '#e2e8f0' }}>
            By clicking <strong>"I Agree & Enter App"</strong>, you acknowledge that you are accessing an active prototype deployed for the <strong>Colosseum Solana Accelerator</strong> track.
          </p>
          
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.78rem'
          }}>
            <p style={{ color: '#fbbf24', fontWeight: 'bold', margin: '0 0 4px 0' }}>
              ⚠️ ACCELERATOR SANDBOX & HYBRID SETTLEMENT NOTICE:
            </p>
            <p style={{ margin: 0, color: '#fde68a' }}>
              Smart contracts and on-chain fee splitting run in a verified test environment on Solana Devnet. Merchant retail rails integrate direct, non-custodial fiat QRIS endpoints paired with an automated on-chain Prepaid SOL Gas Tank.
            </p>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 12px' }}>
            <strong style={{ color: '#38bdf8', fontSize: '0.8rem' }}>1. Non-Custodial Architecture:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
              ZoniqFi never takes custody of user cryptographic private keys. All on-chain actions (DEX Swaps, Vault Deposits, and Gas Tank funding) are signed locally by your client wallet (Phantom, Solflare, etc.).
            </p>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 12px' }}>
            <strong style={{ color: '#fbbf24', fontSize: '0.8rem' }}>2. PayFi Direct Settlement & Gas Tank Policy:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
              100% of customer fiat (QRIS) settles directly to the merchant's personal bank/e-wallet account without intermediary platform escrow. The platform's 5% protocol fee is debited from the vendor's SOL gas reserve and split on-chain. Automated guardrails halt checkouts if vendor reserves are depleted.
            </p>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 12px' }}>
            <strong style={{ color: '#c084fc', fontSize: '0.8rem' }}>3. Anti-MEV & Anti-Sybil Defense:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
              Swap infrastructure utilizes Jito Block Engine bundle concepts to mitigate MEV and front-running risks. On-chain affiliate links and SNS domain resolutions enforce automated rate limits to prevent bot abuse.
            </p>
          </div>
          
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 12px' }}>
            <strong style={{ color: '#4ade80', fontSize: '0.8rem' }}>4. Experimental Prototype & Jurisdiction Disclaimer:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
              This platform represents experimental software built for hackathon and venture acceleration demonstration. It does not constitute financial, investment, or banking services. Access is restricted for persons subject to international sanctions or prohibited local jurisdictions.
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