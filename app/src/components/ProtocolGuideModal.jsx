import React, { useState, useEffect } from 'react';

const CONTENT = {
  EN: {
    badge: "OFFICIAL ARCHITECTURE & USER MANUAL",
    title: "ZoniqFi Protocol Operational Guide",
    subtitle: "Comprehensive architectural breakdown and module interactions.",
    tabs: { all: "All Modules", swap: "01. Swap", lock: "02. Lock", vault: "03. Vault", affiliate: "04. Affiliate" },
    modules: {
      swap: {
        tag: "TX V1 ATOMIC",
        title: "01. AMM DEX Swap Engine",
        desc: "High-throughput decentralized exchange architecture utilizing Solana Transaction v1 (4,096-byte atomic payload) integrated with Jito Block Engine private bundles.",
        highlights: [
          { label: "Anti-MEV Protection", val: "Private transaction routing completely eliminates front-running and sandwich attacks." },
          { label: "0.3% Flat Protocol Fee", val: "Distributed systematically: 40% to Yield Vault, 30% to $ZQI Real Yield Pool, 15% to Affiliate Treasury, and 15% to Operations." },
          { label: "Anti-Wash Trading", val: "Strict rate-limit filters to prevent artificial volume inflation." }
        ]
      },
      lock: {
        tag: "0% INFLATION",
        title: "02. $ZQI Lock & Real Yield",
        desc: "Native token staking mechanism that distributes pure USDC dividends generated from platform trading volume, creating non-inflationary yield.",
        highlights: [
          { label: "Lock Multipliers", val: "30 Days (1.0x), 90 Days (1.5x), and 180 Days (2.5x weight) for dividend calculation." },
          { label: "USDC Real Yield", val: "Dividends paid directly in stable USDC, avoiding token dilution." },
          { label: "Deflationary Defense", val: "Emergency early unlocks incur a mandatory 10% penalty permanently burned on-chain." }
        ]
      },
      vault: {
        tag: "NON-CUSTODIAL",
        title: "03. Yield Optimizer Vault",
        desc: "Automated compounding yield generation protocol tailored for USDC single-asset liquidity.",
        highlights: [
          { label: "Predictable Yield", val: "Programmatic baseline daily yield of 0.11%, scaling up to 49.1% APY via automated compounding." },
          { label: "Gasless Execution", val: "Smart contracts auto-compound profits periodically without requiring manual gas transactions from depositors." },
          { label: "Instant Liquidity", val: "Withdraw principal and accumulated yield at any time subject to pool liquidity." }
        ]
      },
      affiliate: {
        tag: "SNS & ON-CHAIN",
        title: "04. On-Chain Affiliate Protocol",
        desc: "Decentralized growth infrastructure distributing transparent commission rebates to referrers and creators.",
        subBoxTitle: "Understanding The Two Referral Mechanisms:",
        box1Title: "1. YOUR REFERRAL LINK (For You to Share)",
        box1Desc: "Share your unique URL (e.g. zoniqfi.com?ref=YourWallet). When visitors open this link and connect their wallet, the smart contract permanently binds them as your referee. All future trades generate automated rebates for you.",
        box2Title: "2. REFERRER ADDRESS (Manual Fallback)",
        box2Desc: "For organic visitors who entered without a link. They paste your wallet address or SNS domain (e.g. name.sol) and click 'Verify Link' to anchor the sponsorship on-chain.",
        highlights: [
          { label: "Tiered Rebates", val: "Bronze (10% on $0–$10k volume), Silver (18% on $10k–$100k), Gold (25% on >$100k volume)." },
          { label: "SNS Integration", val: "Full support for Solana Name Service (.sol / .sns) domain resolution." },
          { label: "Anti-Sybil Cooldown", val: "10-second threshold per transaction prevents automated referral farming." }
        ]
      }
    },
    closeBtn: "Close Guide"
  },
  ID: {
    badge: "PANDUAN OPERASIONAL & ARSITEKTUR RESMI",
    title: "Panduan Protokol ZoniqFi",
    subtitle: "Penjelasan mendalam arsitektur modul dan mekanisme transaksi.",
    tabs: { all: "Semua Modul", swap: "01. Swap", lock: "02. Lock", vault: "03. Vault", affiliate: "04. Afiliasi" },
    modules: {
      swap: {
        tag: "TX V1 ATOMIC",
        title: "01. AMM DEX Swap Engine",
        desc: "Arsitektur pertukaran terdesentralisasi berkecepatan tinggi memanfaatkan Solana Transaction v1 (payload 4.096-byte) terintegrasi dengan bundel privat Jito Block Engine.",
        highlights: [
          { label: "Perlindungan Anti-MEV", val: "Perutean transaksi privat mengeliminasi serangan front-running dan sandwich secara total." },
          { label: "Biaya Flat 0.3%", val: "Didistribusikan secara transparan: 40% ke Yield Vault, 30% ke Kolam Real Yield $ZQI, 15% ke Kas Afiliasi, dan 15% untuk Operasional." },
          { label: "Anti-Wash Trading", val: "Filter ambang batas transaksi on-chain untuk mencegah manipulasi volume semu." }
        ]
      },
      lock: {
        tag: "0% INFLASI",
        title: "02. $ZQI Lock & Real Yield",
        desc: "Mekanisme penguncian token asli yang membagikan dividen likuid USDC murni dari perputaran biaya trading platform tanpa emisi inflasi.",
        highlights: [
          { label: "Pengali Kunci (Multiplier)", val: "30 Hari (1.0x), 90 Hari (1.5x), dan 180 Hari (2.5x bobot) untuk alokasi porsi dividen." },
          { label: "Dividen USDC Riil", val: "Imbal hasil dibagikan dalam stablecoin USDC, menjaga nilai modal investor dari risiko volatilitas." },
          { label: "Pertahanan Deflasi", val: "Pembukaan kunci darurat sebelum jatuh tempo memicu denda penalti 10% yang dibakar (burned) permanen." }
        ]
      },
      vault: {
        tag: "NON-KUSTODIAL",
        title: "03. Yield Optimizer Vault",
        desc: "Protokol penghasil imbal hasil majemuk otomatis yang dioptimalkan untuk likuiditas aset tunggal USDC.",
        highlights: [
          { label: "Hasil Terprogram", val: "Tingkat dasar harian terprogram 0.11%, dapat mencapai optimalisasi hingga 49.1% APY melalui efek majemuk." },
          { label: "Bebas Biaya Gas Manual", val: "Smart contract menggandakan imbal hasil secara otomatis tanpa pengguna perlu mengeksekusi panen manual." },
          { label: "Likuiditas Fleksibel", val: "Penarikan modal pokok dan akumulasi bunga dapat dilakukan sewaktu-waktu sesuai ketersediaan likuiditas." }
        ]
      },
      affiliate: {
        tag: "SNS & ON-CHAIN",
        title: "04. Protokol Afiliasi On-Chain",
        desc: "Infrastruktur pertumbuhan terdesentralisasi yang memberikan komisi rabat transparan kepada kreator dan pengundang.",
        subBoxTitle: "Perbedaan Dua Fitur Rujukan:",
        box1Title: "1. YOUR REFERRAL LINK (Untuk Anda Sebarkan)",
        box1Desc: "Bagikan tautan unik Anda (contoh: zoniqfi.com?ref=DompetAnda). Saat teman membuka tautan ini dan mengkoneksikan dompet, smart contract mengunci mereka sebagai bawahan Anda secara permanen. Anda otomatis memperoleh rabat setiap mereka melakukan transaksi.",
        box2Title: "2. REFERRER ADDRESS (Alternatif Verifikasi Manual)",
        box2Desc: "Disediakan untuk pengguna yang datang langsung tanpa tautan rujukan. Mereka cukup menempelkan alamat dompet atau domain SNS Anda (misal: nama.sol) lalu mengeklik 'Verify Link' untuk mengikat rujukan secara on-chain.",
        highlights: [
          { label: "Komisi Berjenjang", val: "Bronze (rabat 10% pada volume $0–$10k), Silver (18% pada volume $10k–$100k), Gold (25% pada volume >$100k)." },
          { label: "Integrasi Domain SNS", val: "Mendukung penuh pembacaan domain Solana Name Service (.sol / .sns)." },
          { label: "Cooldown Anti-Sybil", val: "Jeda 10 detik per transaksi rujukan untuk memitigasi eksploitasi bot." }
        ]
      }
    },
    closeBtn: "Tutup Panduan"
  }
};

const ProtocolGuideModal = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState('EN');
  const [activeSection, setActiveSection] = useState('all');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const t = CONTENT[lang];

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(3, 7, 18, 0.9)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
        padding: '16px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0b1326',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '20px',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.08)',
          overflow: 'hidden',
          color: '#f3f4f6',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* MODAL HEADER */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#080d1a',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                {t.badge}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
              {t.title}
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              {t.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '3px'
            }}>
              <button
                type="button"
                onClick={() => setLang('EN')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: lang === 'EN' ? '#fff' : '#94a3b8',
                  background: lang === 'EN' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ID')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: lang === 'ID' ? '#fff' : '#94a3b8',
                  background: lang === 'ID' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ID
              </button>
            </div>

            <button 
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#cbd5e1',
                fontSize: '1.25rem',
                cursor: 'pointer',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              &times;
            </button>
          </div>
        </div>

        {/* SECTION FILTER TABS */}
        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid #1e293b',
          background: '#070c18',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          {Object.keys(t.tabs).map((secKey) => (
            <button
              key={secKey}
              type="button"
              onClick={() => setActiveSection(secKey)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '32px',
                padding: '0 14px',
                boxSizing: 'border-box',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: activeSection === secKey ? '700' : '600',
                color: activeSection === secKey ? '#ffffff' : '#94a3b8',
                background: activeSection === secKey ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: activeSection === secKey ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              {t.tabs[secKey]}
            </button>
          ))}
        </div>

        {/* SCROLLABLE BODY */}
        <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 01. SWAP */}
          {(activeSection === 'all' || activeSection === 'swap') && (
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.05rem', fontWeight: '700' }}>
                  {t.modules.swap.title}
                </h3>
                <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  {t.modules.swap.tag}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 12px 0' }}>{t.modules.swap.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {t.modules.swap.highlights.map((h, i) => (
                  <div key={i} style={{ fontSize: '0.83rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                    <strong style={{ color: '#f8fafc' }}>{h.label}:</strong> {h.val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 02. LOCK */}
          {(activeSection === 'all' || activeSection === 'lock') && (
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#c084fc', fontSize: '1.05rem', fontWeight: '700' }}>
                  {t.modules.lock.title}
                </h3>
                <span style={{ fontSize: '0.72rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  {t.modules.lock.tag}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 12px 0' }}>{t.modules.lock.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {t.modules.lock.highlights.map((h, i) => (
                  <div key={i} style={{ fontSize: '0.83rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                    <strong style={{ color: '#f8fafc' }}>{h.label}:</strong> {h.val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 03. VAULT */}
          {(activeSection === 'all' || activeSection === 'vault') && (
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#60a5fa', fontSize: '1.05rem', fontWeight: '700' }}>
                  {t.modules.vault.title}
                </h3>
                <span style={{ fontSize: '0.72rem', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  {t.modules.vault.tag}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 12px 0' }}>{t.modules.vault.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {t.modules.vault.highlights.map((h, i) => (
                  <div key={i} style={{ fontSize: '0.83rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                    <strong style={{ color: '#f8fafc' }}>{h.label}:</strong> {h.val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 04. AFFILIATE */}
          {(activeSection === 'all' || activeSection === 'affiliate') && (
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#4ade80', fontSize: '1.05rem', fontWeight: '700' }}>
                  {t.modules.affiliate.title}
                </h3>
                <span style={{ fontSize: '0.72rem', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  {t.modules.affiliate.tag}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 14px 0' }}>{t.modules.affiliate.desc}</p>
              
              <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.86rem', color: '#38bdf8' }}>{t.modules.affiliate.subBoxTitle}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ color: '#34d399', fontWeight: '700', fontSize: '0.82rem', marginBottom: '4px' }}>{t.modules.affiliate.box1Title}</div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>{t.modules.affiliate.box1Desc}</p>
                  </div>
                  <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ color: '#a78bfa', fontWeight: '700', fontSize: '0.82rem', marginBottom: '4px' }}>{t.modules.affiliate.box2Title}</div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>{t.modules.affiliate.box2Desc}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {t.modules.affiliate.highlights.map((h, i) => (
                  <div key={i} style={{ fontSize: '0.83rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                    <strong style={{ color: '#f8fafc' }}>{h.label}:</strong> {h.val}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#080d1a',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
            © 2026 ZoniqFi Protocol • Decentralized Technical Documentation
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: '#fff',
              border: 'none',
              padding: '7px 18px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolGuideModal;