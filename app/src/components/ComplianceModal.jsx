import React, { useState, useEffect } from 'react';

const ComplianceModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('zoniqfi_demo_disclaimer_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('zoniqfi_demo_disclaimer_accepted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
      padding: '20px'
    }}>
      
      <div style={{
        backgroundColor: '#111111', border: '1px solid #27272a',
        maxWidth: '500px', width: '100%', borderRadius: '12px',
        padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        color: '#ffffff', fontFamily: 'sans-serif', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* PERBAIKAN SINTAKS: Inject stylesheet kustom untuk scrollbar agar lolos validasi compiler */}
        <style dangerouslySetInnerHTML={{__html: `
          .vzt-scroll-area::-webkit-scrollbar { width: 4px; }
          .vzt-scroll-area::-webkit-scrollbar-track { background: #111; }
          .vzt-scroll-area::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        `}} />

        <h2 style={{
          fontSize: '1.15rem', fontWeight: 'bold', color: '#14F195',
          letterSpacing: '0.05em', borderBottom: '1px solid #27272a',
          paddingBottom: '12px', margin: '0 0 16px 0', flexShrink: 0
        }}>
          ZONIQFI | TERMS & DEMO COMPLIANCE
        </h2>
        
        {/* AREA SCROLL DENGAN CLASS KHUSUS */}
        <div className="vzt-scroll-area" style={{
          fontSize: '0.85rem', color: '#a1a1aa', lineHeight: '1.6', 
          display: 'flex', flexDirection: 'column', gap: '12px',
          maxHeight: '260px', overflowY: 'auto', paddingRight: '6px'
        }}>
          <p style={{ margin: 0 }}>
            By clicking <strong>"I Agree & Enter App"</strong>, you explicitly acknowledge that you are entering the official white-label sandbox preview for the <strong>ZoniqFi Infrastructure Protocol</strong>.
          </p>
          
          <div style={{
            backgroundColor: 'rgba(39, 39, 42, 0.4)', border: '1px solid #27272a',
            borderRadius: '8px', padding: '12px', fontSize: '0.75rem'
          }}>
            <p style={{ color: '#fbbf24', fontWeight: 'bold', margin: '0 0 4px 0' }}>⚠️ LIVE ENVIRONMENT SIMULATION:</p>
            <p style={{ margin: 0, color: '#e4e4e7' }}>
              This interface serves as a secure multi-tenant staging architecture. All cryptographic interactions are isolated to the Solana Devnet cluster to guarantee risk-free parameters.
            </p>
          </div>

          <p style={{ fontSize: '0.75rem', margin: 0 }}>
            1. <strong>White-Label Customization:</strong> All features shown, including the token swap and real-yield pool allocations, can be customized completely with your tokenomics architecture within 24 hours.
          </p>
          
          <p style={{ fontSize: '0.75rem', margin: 0 }}>
            2. <strong>Non-Custodial Logic:</strong> ZoniqFi software infrastructure layers never store or manage user private keys. Every network handshake is signed directly by the user's secure browser wallet extension.
          </p>

          <p style={{ fontSize: '0.75rem', margin: 0 }}>
            3. <strong>Anti-Exploit Mitigations:</strong> Production licenses feature deep Jito Engine bundles to mitigate heavy front-running risks and include tiered referral structures equipped with malicious multi-wallet prevention.
          </p>
        </div>

        <div style={{
          marginTop: '24px', display: 'flex', gap: '12px', width: '100%', flexShrink: 0
        }}>
          <a 
            href="https://zoniqfi.com" 
            style={{
              flex: 1, textDecoration: 'none', textAlign: 'center', padding: '10px 0',
              borderRadius: '8px', fontSize: '0.875rem', backgroundColor: '#18181b',
              border: '1px solid #27272a', color: '#a1a1aa', fontWeight: '600', transition: '0.2s'
            }}
          >
            Decline & Exit
          </a>
          <button 
            onClick={handleAccept}
            style={{
              flex: 1, padding: '10px 0', borderRadius: '8px', fontSize: '0.875rem',
              backgroundColor: '#14F195', border: 'none', color: '#000000',
              fontWeight: 'bold', cursor: 'pointer', transition: '0.2s',
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