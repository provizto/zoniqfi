import React, { useState } from 'react';

const ADMIN_PIN = "1234"; // Ganti PIN Admin Anda di sini

// DEFAULT TEMPLATE (FULL ENGLISH STANDAR DAPP GLOBAL)
const DEFAULT_HOME_HTML = `
  <div style="display: flex; flex-direction: column; gap: 20px; font-family: inherit;">
    <!-- 1. STATIS PROTOCOL METRICS AT TOP (NO RIGID BOXES) -->
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0 4px 14px 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); gap: 16px; flex-wrap: wrap;">
      <!-- TVL -->
      <div style="display: flex; align-items: baseline; gap: 8px;">
        <span style="font-size: 0.72rem; color: #64748b; font-weight: 600;">TVL</span>
        <span style="font-size: 0.95rem; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">$1,284,159.91</span>
        <span style="font-size: 0.68rem; color: #10b981; font-weight: 600;">↑ 18.4%</span>
      </div>

      <span style="color: rgba(255, 255, 255, 0.1); font-size: 0.75rem;">•</span>

      <!-- Real Yield -->
      <div style="display: flex; align-items: baseline; gap: 8px;">
        <span style="font-size: 0.72rem; color: #64748b; font-weight: 600;">Real Yield</span>
        <span style="font-size: 0.95rem; font-weight: 700; color: #38bdf8;">42.80 SOL</span>
        <span style="font-size: 0.68rem; color: #64748b;">to Locker</span>
      </div>

      <span style="color: rgba(255, 255, 255, 0.1); font-size: 0.75rem;">•</span>

      <!-- Security Engine -->
      <div style="display: flex; align-items: baseline; gap: 8px;">
        <span style="font-size: 0.72rem; color: #64748b; font-weight: 600;">Security Engine</span>
        <span style="font-size: 0.95rem; font-weight: 700; color: #10b981;">PASSED</span>
        <span style="font-size: 0.68rem; color: #34d399;">Zoniq Guard AST</span>
      </div>
    </div>

    <!-- 2. HERO PROMOTION BANNER -->
    <div style="background: linear-gradient(180deg, rgba(14, 23, 42, 0.6) 0%, rgba(8, 13, 24, 0.8) 100%); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 24px 28px; display: flex; flex-direction: column; gap: 14px; position: relative;">
      
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <span style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); color: #38bdf8; padding: 3px 8px; border-radius: 5px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em;">
          OFFICIAL PROMOTION
        </span>
        <h2 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: #ffffff;">
          ZoniqFi PayFi & Relayer Gas Campaign
        </h2>
      </div>

      <p style="margin: 0; font-size: 0.84rem; color: #94a3b8; line-height: 1.6;">
        Welcome to the ZoniqFi Terminal ecosystem! Experience zero-custody on-chain settlement and enjoy up to 50% discount on protocol relayer fees for all merchant QRIS integrations on Solana Devnet.
      </p>

      <!-- Tags -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: 0.72rem; color: #cbd5e1; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); padding: 3px 8px; border-radius: 5px;">
          Zero Custody
        </span>
        <span style="font-size: 0.72rem; color: #cbd5e1; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); padding: 3px 8px; border-radius: 5px;">
          PayFi Multi-Token
        </span>
        <span style="font-size: 0.72rem; color: #cbd5e1; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); padding: 3px 8px; border-radius: 5px;">
          Jito MEV Guard
        </span>
      </div>

      <!-- CTA Button -->
      <div style="margin-top: 4px;">
        <button 
          onclick="window.switchZoniqTab ? window.switchZoniqTab('payfi') : console.log('payfi')"
          style="background: #4f46e5; border: none; color: #ffffff; padding: 8px 16px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease;"
          onmouseover="this.style.background='#4338ca'"
          onmouseout="this.style.background='#4f46e5'"
        >
          Launch PayFi Gateway ↗
        </button>
      </div>
    </div>
  </div>
`;

export default function HomeView({ onNavigateTab }) {
  const [contentHtml, setContentHtml] = useState(() => {
    try {
      const saved = localStorage.getItem('zoniq_home_raw_html');
      return saved || DEFAULT_HOME_HTML;
    } catch {
      return DEFAULT_HOME_HTML;
    }
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [inputCode, setInputCode] = useState(contentHtml);

  // Daftarkan listener global agar tombol CTA di dalam raw HTML bisa pindah tab
  React.useEffect(() => {
    window.switchZoniqTab = (tabName) => {
      if (onNavigateTab) onNavigateTab(tabName);
    };
  }, [onNavigateTab]);

  const handleOpenPin = () => {
    const inputPin = window.prompt("Enter Admin PIN for Overview Canvas:");
    if (inputPin === ADMIN_PIN) {
      setInputCode(contentHtml);
      setIsEditorOpen(true);
    } else if (inputPin !== null) {
      alert("Invalid Admin PIN!");
    }
  };

  const handleSave = () => {
    setContentHtml(inputCode);
    localStorage.setItem('zoniq_home_raw_html', inputCode);
    setIsEditorOpen(false);
  };

  const handleReset = () => {
    if (window.confirm("Reset overview canvas to default English template?")) {
      setInputCode(DEFAULT_HOME_HTML);
      setContentHtml(DEFAULT_HOME_HTML);
      localStorage.removeItem('zoniq_home_raw_html');
      setIsEditorOpen(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      position: 'relative',
      color: '#cbd5e1',
      boxSizing: 'border-box'
    }}>
      {/* TITIK KECIL ADMIN RAHASIA (7px) DI POJOK KANAN ATAS */}
      <span
        onClick={handleOpenPin}
        title="Admin Edit Overview"
        style={{
          position: 'absolute',
          top: '-12px',
          right: '-4px',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          cursor: 'pointer',
          zIndex: 20,
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#38bdf8'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
      />

      {/* RENDER HASIL RAW HTML / SCRIPT */}
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

      {/* MODAL EDIT FULL COPAS HTML / SCRIPT */}
      {isEditorOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div style={{
            background: '#090e1a',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '22px',
            width: '92%',
            maxWidth: '680px',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#ffffff' }}>Overview Canvas Editor (Copas HTML)</h3>
              <button 
                type="button" 
                onClick={() => setIsEditorOpen(false)} 
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: '0 0 10px 0', fontSize: '0.72rem', color: '#64748b' }}>
              Paste any custom HTML / CSS. Use <code>window.switchZoniqTab('swap' | 'payfi' | 'staking')</code> for action buttons.
            </p>

            <textarea
              rows="16"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              style={{
                width: '100%',
                background: '#04070d',
                border: '1px solid #1e293b',
                color: '#38bdf8',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
              <button
                type="button"
                onClick={handleReset}
                style={{ background: 'transparent', border: '1px solid #334155', color: '#ef4444', padding: '8px 14px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Reset Default
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  style={{ background: '#1e293b', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{ background: '#10b981', border: 'none', color: '#ffffff', padding: '8px 18px', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Save Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}