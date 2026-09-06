import { http, createConfig } from "wagmi";
import { sepolia, mainnet, polygon } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

const WALLETCONNECT_PROJECT_ID = "3fcc6bba6f1de962d911bb5b5c3dba68";

export const config = createConfig({
  chains: [sepolia, mainnet, polygon],
  multiInjectedProviderDiscovery: true,
  connectors: [
    metaMask(),
    // 🟣 Konektor Phantom (EVM Provider)
    injected({
      target() {
        return {
          id: "phantom",
          name: "Phantom",
          provider: (typeof window !== "undefined" && (window as any).phantom?.ethereum) || undefined,
        };
      },
    }),
    // 🎒 Konektor Backpack (EVM Provider)
    injected({
      target() {
        return {
          id: "backpack",
          name: "Backpack",
          provider: (typeof window !== "undefined" && (window as any).backpack?.ethereum) || undefined,
        };
      },
    }),
    // 🌐 Universal WalletConnect (Dark Mode)
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
      qrModalOptions: {
        themeMode: "dark",
      },
      metadata: {
        name: "ZoniqFi Digital Core",
        description: "Hybrid Web3 & Fiat Digital Commerce Gateway",
        url: typeof window !== "undefined" ? window.location.origin : "https://www.zoniqfinance.com",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
      },
    }),
    // Fallback EIP-6963 & Injected Extensions
    injected(),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
});