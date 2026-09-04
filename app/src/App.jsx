<button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            Documentation
          </button>

          <a 
            href="https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            Smart Contract ⚙️
          </a>

          <button 
            onClick={() => setShowDisclaimer(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              color: '#94a3b8', 
              fontSize: '0.88rem', 
              cursor: 'pointer', 
              textDecoration: 'none', 
              transition: 'color 0.2s' 
            }}
          >
            Legal Disclaimer
          </button>
        </div>
      </footer>

      {/* MODAL LEGAL DISCLAIMER */}
      {showDisclaimer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            color: '#e2e8f0',
            textAlign: 'left',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛡️ Protocol Disclaimer
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              ZoniqFi is an experimental, non-custodial decentralized software architecture deployed on the Solana Devnet Sandbox. The protocol does not take custody of user assets, and interactions are governed strictly by immutable smart contract logic. Nothing on this platform constitutes financial or investment advice.
            </p>
            <button 
              onClick={() => setShowDisclaimer(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* MODAL EMERGENCY EARLY UNLOCK */}
      {showEmergencyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1322',
            border: '1px solid #ef4444',
            borderRadius: '16px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            color: '#e2e8f0',
            textAlign: 'left',
            boxShadow: '0 20px 50px rgba(239, 68, 68, 0.25)'
          }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1.25rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ Emergency Unlock Warning
            </h3>
            
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              You are executing an early principal redemption before epoch maturity. The protocol will automatically trigger a <strong>10% deflationary penalty burn</strong>.
            </p>

            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '14px', marginBottom: '20px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Total Locked Assets:</span>
                <strong style={{ color: '#ffffff' }}>{stakedAmount} $ZQI</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#ef4444' }}>Deflationary Burn (10%):</span>
                <strong style={{ color: '#ef4444' }}>-{(stakedAmount * 0.10).toFixed(2)} $ZQI</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                <span style={{ color: '#22c55e' }}>Returned to Wallet:</span>
                <strong style={{ color: '#22c55e' }}>+{(stakedAmount * 0.90).toFixed(2)} $ZQI</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowEmergencyModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel / Keep Locked
              </button>
              
              <button 
                onClick={executeEmergencyUnlock}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                }}
              >
                Confirm & Burn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;