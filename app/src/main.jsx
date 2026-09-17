import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Library Resmi Solana Wallet Adapter
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import '@solana/wallet-adapter-react-ui/styles.css'

// Solana Mobile Wallet Adapter (MWA) untuk Browser HP Android
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
} from '@solana-mobile/wallet-adapter-mobile'

function Root() {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

  // Phantom, Backpack, Solflare otomatis terdeteksi via Wallet Standard.
  const wallets = useMemo(
    () => [
      new SolanaMobileWalletAdapter({
        addressSelector: createDefaultAddressSelector(),
        appIdentity: {
          name: 'ZoniqFi Protocol',
          uri: 'https://zoniqfi.com',
          icon: 'https://zoniqfi.com/favicon.png', // Menggunakan absolute URL PNG agar kompatibel di Android MWA
        },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
        cluster: 'devnet',
        onWalletNotFound: createDefaultWalletNotFoundHandler(),
      }),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)