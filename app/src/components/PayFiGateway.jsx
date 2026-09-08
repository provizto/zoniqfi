import React, { Component } from 'react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import DigitalCore from './payfi/DigitalCore';
import '@solana/wallet-adapter-react-ui/styles.css';

// Circuit breaker / Error Boundary to prevent blank application screens
class PayFiErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PayFi Runtime Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          margin: '40px auto',
          maxWidth: '650px',
          padding: '24px',
          background: '#0f172a',
          border: '1px solid #ef4444',
          borderRadius: '16px',
          color: '#f8fafc',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#ef4444', margin: '0 0 12px 0' }}>
            ⚠️ Runtime Component Notice
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 16px 0' }}>
            The PayFi engine encountered a client-side execution issue:
          </p>
          <div style={{
            background: '#020617',
            padding: '12px 16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#fca5a5',
            border: '1px solid #334155',
            wordBreak: 'break-word',
            textAlign: 'left'
          }}>
            {this.state.error?.message || String(this.state.error)}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function PayFiGateway() {
  return (
    <PayFiErrorBoundary>
      <WalletModalProvider>
        <div className="payfi-integrated-wrapper" style={{ width: '100%', minHeight: '80vh' }}>
          <style>{`
            .payfi-integrated-wrapper code {
              background: #090d16 !important;
              color: #38bdf8 !important;
              border: 1px solid #1e293b !important;
              border-radius: 6px !important;
              padding: 3px 8px !important;
              font-family: monospace;
            }
          `}</style>
          <DigitalCore />
        </div>
      </WalletModalProvider>
    </PayFiErrorBoundary>
  );
}