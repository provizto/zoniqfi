import React, { useState } from 'react';

const ADMIN_PIN = "1234"; // Ganti PIN Anda di sini

// HTML DEFAULT: SEMUA MENU DISUSUN MENJADI LIST RAMPING BERAKSEN CHROME HALUS
const DEFAULT_SIDEBAR_HTML = `
  <div style="display: flex; flex-direction: column; gap: 14px; font-family: inherit;">
    <!-- HEADER -->
    <div style="font-size: 0.72rem; font-weight: 800; color: #64748b; letter-spacing: 0.05em; padding-left: 2px;">
      UPDATES & PROTOCOL HUB
    </div>

    <!-- 1. BULLETIN BERITA -->
    <div style="background: rgba(11, 18, 31, 0.55); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 10px; padding: 14px 16px; font-size: 0.8rem; color: #cbd5e1; line-height: 1.5;">
      <p style="margin: 0 0 6px 0;">
        <strong style="color: #38bdf8;">📢 ZoniqFi Update:</strong> Seluruh modul terhubung langsung dengan verifikasi <em>Zoniq Guard AST</em>.
      </p>
      <p style="margin: 0; color: #94a3b8; font-size: 0.74rem;">
        Pastikan koneksi wallet di Solana Devnet sebelum mencoba swap atau staking yield.
      </p>
    </div>

    <!-- 2. RELEASE NOTES -->
    <div style="background: rgba(11, 18, 31, 0.55); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 10px; padding: 14px 16px;">
      <span style="font-size: 0.74rem; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 12px;">Release Notes</span>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="border-left: 2px solid #38bdf8; padding-left: 10px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span style="font-size: 0.65rem; background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 1px 5px; border-radius: 4px; font-weight: 700;">v2.4.2</span>
            <span style="font-size: 0.68rem; color: #64748b;">Oct 2026</span>
          </div>
          <h5 style="margin: 0 0 2px 0; font-size: 0.78rem; color: #ffffff;">Solana Devnet Settlement Live</h5>
          <p style="margin: 0; font-size: 0.72rem; color: #94a3b8; line-height: 1.35;">Atomic multi-pool routing via Jito MEV protection bundler telah aktif.</p>
        </div>
      </div>
    </div>

    <!-- 3. PROTOCOL SUITE & LINKS (SEMUA SERAGAM MODEL LIST RAMPING CHROME) -->
    <div style="background: rgba(11, 18, 31, 0.55); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 10px; padding: 12px 14px;">
      <span style="font-size: 0.7rem; font-weight: 800; color: #64748b; display: block; margin-bottom: 8px;">
        PROTOCOL RESOURCES & LINKS
      </span>
      
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <!-- Row: Protocol Guide (Clickable Action) -->
        <button 
          onclick="window.openZoniqGuide && window.openZoniqGuide()" 
          style="width: 100%; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); color: #cbd5e1; font-size: 0.75rem; display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 6px; cursor: pointer; text-align: left; transition: all 0.15s ease;"
          onmouseover="this.style.background='rgba(255, 255, 255, 0.06)'; this.style.color='#38bdf8'; this.style.borderColor='rgba(56, 189, 248, 0.3)';"
          onmouseout="this.style.background='rgba(255, 255, 255, 0.02)'; this.style.color='#cbd5e1'; this.style.borderColor='rgba(255, 255, 255, 0.05)';"
        >
          <span>📖 Protocol Guide [EN/ID]</span>
          <span style="font-size: 0.68rem; color: #64748b;">Modal ↗</span>
        </button>

        <!-- Row: Pitch Deck (Clickable Action) -->
        <button 
          onclick="window.openZoniqPitch && window.openZoniqPitch()" 
          style="width: 100%; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); color: #cbd5e1; font-size: 0.75rem; display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 6px; cursor: pointer; text-align: left; transition: all 0.15s ease;"
          onmouseover="this.style.background='rgba(255, 255, 255, 0.06)'; this.style.color='#38bdf8'; this.style.borderColor='rgba(56, 189, 248, 0.3)';"
          onmouseout="this.style.background='rgba(255, 255, 255, 0.02)'; this.style.color='#cbd5e1'; this.style.borderColor='rgba(255, 255, 255, 0.05)';"
        >
          <span>📊 Protocol Pitch Deck</span>
          <span style="font-size: 0.68rem; color: #64748b;">Slide ↗</span>
        </button>

        <!-- Row: Squads Treasury -->
        <a 
          href="https://solscan.io/account/HVHRr2JbMAT1zQ8N2vuWKctfV3ycvQYdDDzob1nqd6jD?cluster=devnet" 
          target="_blank" 
          rel="noreferrer" 
          style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); color: #94a3b8; font-size: 0.74rem; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 6px; transition: all 0.15s ease;"
          onmouseover="this.style.background='rgba(255, 255, 255, 0.06)'; this.style.color='#38bdf8'; this.style.borderColor='rgba(56, 189, 248, 0.3)';"
          onmouseout="this.style.background='rgba(255, 255, 255, 0.02)'; this.style.color='#94a3b8'; this.style.borderColor='rgba(255, 255, 255, 0.05)';"
        >
          <span>Squads Multi-Sig Treasury</span>
          <span style="font-size: 0.68rem;">↗</span>
        </a>

        <!-- Row: $ZQI Token Explorer -->
        <a 
          href="https://solscan.io/token/6tbj9HTPYXZia8daATKXMQy15PBavSEnAnfnRk76SMKz?cluster=devnet" 
          target="_blank" 
          rel="noreferrer" 
          style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); color: #94a3b8; font-size: 0.74rem; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 6px; transition: all 0.15s ease;"
          onmouseover="this.style.background='rgba(255, 255, 255, 0.06)'; this.style.color='#38bdf8'; this.style.borderColor='rgba(56, 189, 248, 0.3)';"
          onmouseout="this.style.background='rgba(255, 255, 255, 0.02)'; this.style.color='#94a3b8'; this.style.borderColor='rgba(255, 255, 255, 0.05)';"
        >
          <span>$ZQI Devnet Explorer</span>
          <span style="font-size: 0.68rem;">↗</span>
        </a>

        <!-- Row: Telegram Community -->
        <a 
          href="https://t.me/zoniqfi_community" 
          target="_blank" 
          rel="noreferrer" 
          style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); color: #94a3b8; font-size: 0.74rem; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 6px; transition: all 0.15s ease;"
          onmouseover="this.style.background='rgba(255, 255, 255, 0.06)'; this.style.color='#38bdf8'; this.style.borderColor='rgba(56, 189, 248, 0.3)';"
          onmouseout="this.style.background='rgba(255, 255, 255, 0.02)'; this.style.color='#94a3b8'; this.style.borderColor='rgba(255, 255, 255, 0.05)';"
        >
          <span>Komunitas Telegram Resmi</span>
          <span style="font-size: 0.68rem;">↗</span>
        </a>
      </div>

      <!-- Legal Disclaimer Baris Bawah Ramping -->
      <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
        <button 
          onclick="window.openZoniqDisclaimer && window.openZoniqDisclaimer()" 
          style="background: none; border: none; color: #475569; font-size: 0.7rem; cursor: pointer; text-decoration: underline;"
        >
          Legal Disclaimer
        </button>
      </div>
    </div>
  </div>
`;

export default function RightSidebarFeed() {
  const [contentHtml, setContentHtml] = useState(() => {
    try {
      const saved = localStorage.getItem('zoniq_sidebar_raw_html');
      return saved || DEFAULT_SIDEBAR_HTML;
    } catch {
      return DEFAULT_SIDEBAR_HTML;
    }
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [inputCode, setInputCode] = useState(contentHtml);

  const handleOpenPin = () => {
    const inputPin = window.prompt("Masukkan PIN Admin:");
    if (inputPin === ADMIN_PIN) {
      setInputCode(contentHtml);
      setIsEditorOpen(true);
    } else if (inputPin !== null) {
      alert("PIN salah!");
    }
  };

  const handleSave = () => {
    setContentHtml(inputCode);
    localStorage.setItem('zoniq_sidebar_raw_html', inputCode);
    setIsEditorOpen(false);
  };

  const handleReset = () => {
    if (window.confirm("Kembalikan ke susunan list chrome default?")) {
      setInputCode(DEFAULT_SIDEBAR_HTML);
      setContentHtml(DEFAULT_SIDEBAR_HTML);
      localStorage.removeItem('zoniq_sidebar_raw_html');
      setIsEditorOpen(false);
    }
  };

  return (
    <aside style={{
      width: '100%',
      position: 'relative',
      color: '#e2e8f0',
      boxSizing: 'border-box'
    }}>
      {/* TITIK KECIL ADMIN RAHASIA (6px) */}
      <span
        onClick={handleOpenPin}
        title="Admin Edit"
        style={{
          position: 'absolute',
          top: '-12px',
          right: '-4px',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#38bdf8'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
      />

      {/* RENDER LIST RAMPING */}
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

      {/* MODAL COPAS SCRIPT / HTML */}
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
              <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#ffffff' }}>Admin Editor Kolom Kanan</h3>
              <button 
                type="button" 
                onClick={() => setIsEditorOpen(false)} 
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <textarea
              rows="15"
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
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{ background: '#10b981', border: 'none', color: '#ffffff', padding: '8px 18px', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Simpan Tampilan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}