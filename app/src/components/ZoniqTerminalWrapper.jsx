import React from 'react';
import HomeView from './HomeView';
import RightSidebarFeed from './RightSidebarFeed';

export default function ZoniqTerminalWrapper({
  activeTab,
  setActiveTab,
  showSwap,
  showLocker,
  showOptimizer,
  showAffiliate,
  protocolTVL,
  children
}) {
  const navTabs = [
    {
      id: 'home',
      label: 'Overview',
      visible: true,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      id: 'swap',
      label: 'AMM DEX Swap',
      visible: showSwap,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9"></polyline>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
          <polyline points="7 23 3 19 7 15"></polyline>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
      )
    },
    {
      id: 'staking',
      label: 'ZQI Real Yield',
      visible: showLocker,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    },
    {
      id: 'vault',
      label: 'Yield Optimizer',
      visible: showOptimizer,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    {
      id: 'affiliate',
      label: 'On-Chain Affiliate',
      visible: showAffiliate,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 'payfi',
      label: 'PayFi Gateway',
      visible: true,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      )
    },
  ];

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      minHeight: 'calc(100vh - 60px)',
      background: '#060913',
      color: '#cbd5e1',
      boxSizing: 'border-box'
    }}>
      {/* SIDEBAR PERSIS GUARD (220px, Monokrom, Rounded Smooth) */}
      <aside style={{
        width: '220px',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        background: '#070b15',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px',
        gap: '4px',
        flexShrink: 0,
        boxSizing: 'border-box'
      }}>
        {navTabs.filter(t => t.visible).map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#131b2e' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                fontSize: '0.82rem',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#64748b';
              }}
            >
              <span style={{ color: isActive ? '#38bdf8' : 'currentColor', display: 'flex' }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* LINK KE GUARD SUITE DI BAWAH SIDEBAR */}
        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <a
            href="https://guard.zoniqfi.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '0.78rem',
              textDecoration: 'none',
              background: 'rgba(255, 255, 255, 0.02)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Zoniq Guard</span>
            </div>
            <span style={{ fontSize: '0.7rem' }}>↗</span>
          </a>
        </div>
      </aside>

      {/* KANVAS MODUL TENGAH */}
      <main style={{
        flex: 1,
        padding: '24px 32px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 0,
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', maxWidth: '840px' }}>
          {activeTab === 'home' ? (
            <HomeView protocolTVL={protocolTVL} onNavigateTab={(tab) => setActiveTab(tab)} />
          ) : (
            children
          )}
        </div>
      </main>

      {/* KOLOM KANAN UPDATES */}
      <div style={{
        width: '320px',
        borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
        background: '#070b15',
        padding: '18px',
        overflowY: 'auto',
        flexShrink: 0,
        boxSizing: 'border-box'
      }}>
        <RightSidebarFeed />
      </div>
    </div>
  );
}