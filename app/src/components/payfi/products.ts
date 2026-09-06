export interface Product {
  id: number;
  name: string;
  description: string;
  defaultPriceEth: string;
  badge?: string;
  deliverables?: string[];
}

export const WHITELABEL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Zoniqfi Full Source Code & License",
    description: "Lisensi resmi source code hybrid payment gateway Web3 + QRIS + Stripe lengkap dengan backend gasless relayer engine.",
    defaultPriceEth: "0.005",
    badge: "Best Seller",
    deliverables: [
      "Full GitHub Repository Access",
      "Gasless Mint Relayer Engine",
      "Multi-Currency Settlement Logic"
    ]
  },
  {
    id: 2,
    name: "Web3 Smart Contract Master Template",
    description: "Kumpulan template smart contract DeFi & NFT siap deploy ke Sepolia Testnet maupun Mainnet.",
    defaultPriceEth: "0.002",
    badge: "Developer",
    deliverables: [
      "Anchor & Solidity Architectures",
      "Automated Security Test Suites",
      "Turnkey Deployment Scripts"
    ]
  },
  {
    id: 3,
    name: "VIP Private Community & Mentoring",
    description: "Akses seumur hidup ke grup privat Telegram dan sesi konsultasi teknis arsitektur Web3.",
    defaultPriceEth: "0.001",
    badge: "Membership",
    deliverables: [
      "1-on-1 Architecture Consultation",
      "Direct Telegram Core Channel",
      "Continuous Protocol Updates"
    ]
  }
];