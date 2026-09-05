import React, { useEffect } from 'react';

const ComplianceModal = ({ isOpen = true, onClose, onAccept }) => {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '20px'
      }}
    >
      <div style={{
        backgroundColor: '#111111',
        border: '1px solid #27272a',
        maxWidth: '520px',
        width: '100%',
        borderRadius: '14px',
        padding: '24px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        <h2 style={{
          fontSize: '1.15rem',
          fontWeight: 'bold',
          color: '#14F195',
          letterSpacing: '0.05em',
          borderBottom: '1px solid #27272a',
          paddingBottom: '12px',
          margin: '0 0 16px 0',
          flexShrink: 0
        }}>
          ZONIQFI | TERMS & DEMO COMPLIANCE
        </h2>
        
        {/* SCROLL AREA */}
        <div style={{
          fontSize: '0.85rem',
          color: '#a1a1aa',
          lineHeight: '1.6',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '260px',
          overflowY: 'auto',
          paddingRight: '6px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#27272a #111111'
        }}>
          <p style={{ margin: 0 }}>
            By clicking <strong>"I Agree & Enter App"</strong>, you explicitly acknowledge that you are entering the official sandbox preview for the <strong>ZoniqFi Infrastructure Protocol</strong>.
          </p>
          
          <div style={{
            backgroundColor: 'rgba(39, 39, 42, 0.4)',
            border: '1px solid #27272a',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.75rem'
          }}>
            <p style={{ color: '#fbbf24', fontWeight: 'bold', margin: '0 0 4px 0' }}>
              ⚠️ LIVE ENVIRONMENT SIMULATION:
            </p>
            <p style={{ margin: 0, color: '#e4e4e7' }}>
              This interface serves as a secure multi-tenant staging architecture. All cryptographic interactions are isolated to the Solana Devnet cluster to guarantee risk-free testing parameters.
            </p>
          </div>

          <p style={{ fontSize: '0.75rem', margin: 0 }}>
            1. <strong>White-Label Customization:</strong> All protocol modules, fee routing matrices, and real-yield pools can be adapted to custom SPL tokenomics.
          </p>
          
          <p style={{ fontSize: '0.75rem', margin: 0 }}>
            2. <strong>Non-Custodial Logic:</strong> ZoniqFi software infrastructure layers never store or manage user private keys. Every network handshake is signed directly by the user's browser wallet extension.
          </p>

          <p style={{ fontSize: '0.75rem', margin: 0 }}>
            3. <strong>Anti-Exploit Mitigations:</strong> Features deep Jito Block Engine bundles to mitigate front-running/sandwich risks and includes tiered referral structures equipped with malicious multi-wallet prevention.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{
          marginTop: '24px',
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
              padding: '10px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              color: '#a1a1aa',
              fontWeight: '600',
              transition: '0.2s',
              cursor: 'pointer'
            }}
          >
            Decline & Exit
          </button>
          
          <button 
            type="button"
            onClick={handleAccept}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: '#14F195',
              border: 'none',
              color: '#000000',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.2s',
              boxShadow: '0 0 15px rgba(20,241,149,0.3)'
            }}
          >
            I Agree & Enter App
          </button>
        </div>

      </div>
    </div>
  );
};

export default ComplianceModal;