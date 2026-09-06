import { useEffect, useState, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { supabase } from "./supabaseClient";

export interface StoreProduct {
  id: number;
  db_id?: string;
  sku?: string;
  name: string;
  desc: string;
  priceEth: string;
  badge?: string;
  deliverables?: string[];
  vendor_wallet?: string;
}

export interface VendorProfile {
  id?: string;
  wallet_address: string;
  store_name: string;
  contact_email?: string;
  bio?: string;
  payout_bank_name?: string;
  payout_account_number?: string;
}

export interface StoreConfig {
  storeName: string;
  storeSubtitle?: string;
  rateIdr: number;
  rateUsd: number;
  adminPin: string;
  customQrisCode?: string;
  customQrImage?: string;
  adminBankName?: string;
  adminAccountNumber?: string;
  adminAccountHolder?: string;
}

interface SuccessDeliveryData {
  product: StoreProduct;
  txHash: string;
  buyer: string;
  tokenId: string;
  method: string;
}

interface AdminVendorPayoutItem {
  wallet_address: string;
  store_name: string;
  contact_email?: string;
  payout_bank_name?: string;
  payout_account_number?: string;
  total_orders: number;
  gross_sales_eth: number;
  net_vendor_earnings_eth: number;
  platform_fee_eth: number;
}

const DEFAULT_CONFIG: StoreConfig = {
  storeName: "Zoniqfi Marketplace",
  storeSubtitle: "Official Hybrid Web3 & Digital License Gateway",
  rateIdr: 54000000,
  rateUsd: 3500,
  adminPin: "737806",
  customQrisCode: "",
  customQrImage: "/qris.jpg",
  adminBankName: "BCA",
  adminAccountNumber: "1234567890",
  adminAccountHolder: "ZoniqFi Platform Admin"
};

const PAYFI_CATEGORY_OPTIONS = [
  "💎 NFT & Web3 Collectibles",
  "💻 Software & Source Code",
  "📚 E-Books & Educational Docs",
  "🎨 Design, UI/UX & 3D Assets",
  "🔑 Licenses & Digital Accounts",
  "🛠️ Digital Services & Freelance",
  "👕 Fashion & Merchandise",
  "📱 Gadgets & Hardware Tech",
  "📦 Physical Goods & MSMEs (RWA)"
];

const TRANSLATIONS = {
  ID: {
    connectWallet: "🔌 Hubungkan Wallet",
    disconnect: "Keluar",
    selectWallet: "🔌 Pilih Provider Wallet",
    connectBtn: "Hubungkan",
    verifyBtn: "🔍 Cek Lisensi",
    catalogHeading: "Katalog Produk & Lisensi Digital",
    catalogSub: "Etalase resmi produk digital terverifikasi dengan lisensi on-chain instan.",
    buyNow: "🛒 Beli Sekarang",
    checkoutTag: "CHECKOUT PRODUK",
    searchPlaceholder: "🔍 Cari lisensi, kreator, SKU, atau kata kunci...",
    allCategory: "Semua Kategori",
    noProductsFound: "Tidak ada produk yang cocok dengan filter / pencarian.",
    prevPage: "← Sebelumnya",
    nextPage: "Berikutnya →",
    pageIndicator: (curr: number, total: number) => `Halaman ${curr} dari ${total}`,
    emailLabel: "📧 Email Penerima Lisensi & Akses File:",
    emailPlaceholder: "nama@domain.com (wajib untuk menerima link & invoice)",
    method1Tag: "METODE 1: WEB3 DIRECT",
    method1Title: "Crypto-Native Wallet",
    method1Desc: "Pembelian on-chain langsung via smart contract menggunakan Solana Devnet wallet.",
    method1BtnPending: "Memproses Transaksi di Wallet...",
    method1BtnConfirming: "⏳ Menunggu Konfirmasi Blok On-Chain...",
    method1BtnBuy: (eth: string) => `⚡ Beli via Web3 (${eth} SOL)`,
    method2Tag: "METODE 2: QRIS STANDAR",
    method2Title: "QRIS & e-Wallet Indonesia",
    method2Desc: "Bayar instan via BCA, Mandiri, GoPay, OVO, DANA. Lisensi NFT dicetak otomatis.",
    method2BtnPay: "📱 Buka Barcode QRIS",
    vendorBtn: "🚀 Portal Vendor",
    vendorModalTitle: "🏪 Vendor & Merchant Portal",
    adminBtn: "⚙️ Pengaturan Global (Admin)",
    adminPinTitle: "Akses Panel Pengaturan Toko",
    adminPinSub: "Masukkan 6-Digit PIN Keamanan Admin",
    adminPinPlaceholder: "6-Digit PIN",
    adminPinSubmit: "Buka Pengaturan",
    adminModalTitle: "⚙️ Kelola Platform & Settlement",
    storeNameLabel: "Nama Platform:",
    storeSubtitleLabel: "Slogan Platform:",
    fxRateHeading: "💱 Kurs Acuan Fiat (1 SOL)",
    rateIdrLabel: "Kurs SOL (IDR):",
    rateUsdLabel: "Kurs SOL (USD):",
    pinLabel: "PIN Admin:",
    qrisSectionTitle: "📱 PENGATURAN MASTER QRIS",
    qrisUploadLabel: "1. Unggah Gambar Barcode QRIS:",
    qrisStringLabel: "2. Atau Tempel String / Payload QRIS:",
    resetDefault: "Reset Default",
    saveStore: "💾 Simpan Perubahan Platform",
    qrisDownload: "💾 Download QR Code",
    cancel: "Batal",
    monitorHeading: "⚡ Monitor Broadcast Sistem:",
    monitorProcessing: "⏳ Menunggu konfirmasi pembayaran...",
    monitorSigning: "⏳ Memproses persetujuan tanda tangan wallet...",
    monitorSuccess: "✅ Berhasil Diselesaikan! Tx Signature:",
    deliverySuccessTitle: "🎉 Pembelian Berhasil & Lisensi Aktif!",
    deliverySuccessSub: "NFT Lisensi on-chain telah dicetak dan akses deliverables sudah terbuka.",
    downloadAssetBtn: "📥 Download Sertifikat & Akses File (.ZIP / PDF)",
    footerText: "Hak cipta dilindungi undang-undang. ZoniqFi Enterprise Hybrid Commerce Ecosystem."
  },
  EN: {
    connectWallet: "🔌 Connect Wallet",
    disconnect: "Disconnect",
    selectWallet: "🔌 Select Wallet Provider",
    connectBtn: "Connect",
    verifyBtn: "🔍 Verify License",
    catalogHeading: "Digital Products & License Catalog",
    catalogSub: "Official digital goods catalog with instant on-chain license verification.",
    buyNow: "🛒 Buy Now",
    checkoutTag: "PRODUCT CHECKOUT",
    searchPlaceholder: "🔍 Search license, creator, SKU, or keyword...",
    allCategory: "All Categories",
    noProductsFound: "No products match your search/filter.",
    prevPage: "← Previous",
    nextPage: "Next →",
    pageIndicator: (curr: number, total: number) => `Page ${curr} of ${total}`,
    emailLabel: "📧 Delivery Email & Access Key:",
    emailPlaceholder: "name@domain.com (required to receive deliverables & invoice)",
    method1Tag: "METHOD 1: WEB3 DIRECT",
    method1Title: "Crypto-Native Wallet",
    method1Desc: "Direct on-chain purchase via smart contract using your Solana Devnet wallet.",
    method1BtnPending: "Processing Transaction in Wallet...",
    method1BtnConfirming: "⏳ Awaiting On-Chain Block Confirmation...",
    method1BtnBuy: (eth: string) => `⚡ Buy with Web3 (${eth} SOL)`,
    method2Tag: "METHOD 2: QRIS STANDARD",
    method2Title: "QRIS & Indonesian e-Wallet",
    method2Desc: "Instant payment via BCA, Mandiri, GoPay, OVO, DANA. NFT minted via gasless relay.",
    method2BtnPay: "📱 Open QRIS Barcode",
    vendorBtn: "🚀 Vendor Portal",
    vendorModalTitle: "🏪 Vendor & Merchant Portal",
    adminBtn: "⚙️ Global Settings (Admin)",
    adminPinTitle: "Store Admin Panel Access",
    adminPinSub: "Enter 6-Digit Admin Security PIN",
    adminPinPlaceholder: "6-Digit PIN",
    adminPinSubmit: "Open Panel",
    adminModalTitle: "⚙️ Manage Platform & Settlement",
    storeNameLabel: "Platform Name:",
    storeSubtitleLabel: "Tagline / Subtitle:",
    fxRateHeading: "💱 Fiat Reference FX Rates (1 SOL)",
    rateIdrLabel: "SOL Rate (IDR):",
    rateUsdLabel: "SOL Rate (USD):",
    pinLabel: "Admin PIN:",
    qrisSectionTitle: "📱 MASTER QRIS CONFIGURATION",
    qrisUploadLabel: "1. Upload Barcode QRIS Image:",
    qrisStringLabel: "2. Or Paste QRIS Payload String:",
    resetDefault: "Reset Default",
    saveStore: "💾 Save Platform Settings",
    qrisDownload: "💾 Download QR Code",
    cancel: "Cancel",
    monitorHeading: "⚡ System Broadcast Monitor:",
    monitorProcessing: "⏳ Awaiting settlement confirmation...",
    monitorSigning: "⏳ Processing wallet signature approval...",
    monitorSuccess: "✅ Settled! Tx Signature:",
    deliverySuccessTitle: "🎉 Purchase Settled & License Active!",
    deliverySuccessSub: "On-chain NFT license has been minted and deliverables access is now unlocked.",
    downloadAssetBtn: "📥 Download Certificate & File Access (.ZIP / PDF)",
    footerText: "All rights reserved. ZoniqFi Enterprise Hybrid Commerce Ecosystem."
  }
};

const ITEMS_PER_PAGE = 6;

function MainApp() {
  const t = TRANSLATIONS.EN;

  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem("zoniq_store_config");
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  const [showVendorModal, setShowVendorModal] = useState<boolean>(false);
  const [vendorActiveTab, setVendorActiveTab] = useState<"STATS" | "UPLOAD" | "PRODUCTS">("STATS");
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [vendorStoreName, setVendorStoreName] = useState<string>("");
  const [vendorEmail, setVendorEmail] = useState<string>("");
  const [vendorBank, setVendorBank] = useState<string>("");
  const [vendorAccNumber, setVendorAccNumber] = useState<string>("");
  
  const [isEditingVendorProfile, setIsEditingVendorProfile] = useState<boolean>(false);
  const [isUpdatingVendorProfile, setIsUpdatingVendorProfile] = useState<boolean>(false);

  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editDesc, setEditDesc] = useState<string>("");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editBadge, setEditBadge] = useState<string>("");
  const [isUpdatingProduct, setIsUpdatingProduct] = useState<boolean>(false);

  const [vendorStats, setVendorStats] = useState<{ totalOrders: number; grossEth: number; netEth: number }>({
    totalOrders: 0,
    grossEth: 0,
    netEth: 0
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<"SETTINGS" | "PAYOUTS" | "ORDERS">("SETTINGS");
  const [adminPayouts, setAdminPayouts] = useState<AdminVendorPayoutItem[]>([]);
  const [adminTotalPlatformFee, setAdminTotalPlatformFee] = useState<number>(0);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [inputPin, setInputPin] = useState<string>("");
  const [tempConfig, setTempConfig] = useState<StoreConfig>(storeConfig);

  const [newProductName, setNewProductName] = useState<string>("");
  const [newProductDesc, setNewProductDesc] = useState<string>("");
  const [newProductPrice, setNewProductPrice] = useState<string>("0.003");
  const [newProductBadge, setNewProductBadge] = useState<string>(PAYFI_CATEGORY_OPTIONS[0]);
  const [newProductDeliverable, setNewProductDeliverable] = useState<string>("");
  const [productFile, setProductFile] = useState<File | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBadge, setSelectedBadge] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [verifyQuery, setVerifyQuery] = useState<string>("");
  const [isSearchingLicense, setIsSearchingLicense] = useState<boolean>(false);
  const [verifiedResult, setVerifiedResult] = useState<any>(null);
  const [verifyError, setVerifyError] = useState<string>("");

  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [deliverySuccess, setDeliverySuccess] = useState<SuccessDeliveryData | null>(null);

  const validateCustomerEmail = () => {
    if (!customerEmail || !customerEmail.trim()) {
      alert("⚠️ Please enter a valid delivery email address first!");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(customerEmail.trim())) {
      alert("⚠️ Invalid email format (example: user@domain.com)!");
      return false;
    }
    return true;
  };

  const [fiatPaymentStatus, setFiatPaymentStatus] = useState<string>("IDLE");
  const [, setSelectedCurrency] = useState<string>("USD");
  const [showQrisModal, setShowQrisModal] = useState<boolean>(false);

  const { connection } = useConnection();
  const { publicKey, connected: isConnected, sendTransaction } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();

  const [isTxPending, setIsTxPending] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");
  const [txError, setTxError] = useState<any>(null);
  const connectError = null;

  const address = publicKey ? publicKey.toBase58() : "";
  const walletAddressStr = address;

  const fallbackQrisUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=ZoniqfiMerchantSettlement";

  const activeEthPrice = selectedProduct?.priceEth || "0.005";
  const calculatedIdrPrice = Math.round(Number(activeEthPrice) * (Number(storeConfig?.rateIdr) || 54000000));
  const calculatedUsdPrice = (Number(activeEthPrice) * (Number(storeConfig?.rateUsd) || 3500)).toFixed(2);

  const fetchStoreConfigFromSupabase = async () => {
    try {
      const { data } = await supabase
        .from("platform_settings")
        .select("config")
        .eq("id", "main_config")
        .maybeSingle();

      if (data?.config) {
        setStoreConfig((prev) => ({ ...prev, ...data.config }));
      }
    } catch (err) {
      console.warn("Gagal load config cloud:", err);
    }
  };
  
  const fetchProductsFromSupabase = async () => {
    try {
      setIsLoadingProducts(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const mapped: StoreProduct[] = data.map((item: any, idx: number) => ({
          id: item.sku ? Number(String(item.sku).replace(/\D/g, "")) || (idx + 1) : idx + 1,
          db_id: item.id,
          sku: item.sku,
          name: item.title || item.name || "Digital Product",
          desc: item.description || "",
          priceEth: String(item.price_eth || "0.001"),
          badge: item.category || item.badge || "General",
          deliverables: item.download_url ? [item.download_url] : (item.deliverables || ["Direct Download Access"]),
          vendor_wallet: item.vendor_wallet || undefined
        }));
        setProducts(mapped);
      } else {
        setProducts([
          {
            id: 1,
            sku: "SKU-01",
            name: "Solana PayFi Full Source Code",
            desc: "Complete enterprise architecture for Web3 and Fiat hybrid commerce gateway.",
            priceEth: "0.005",
            badge: "💻 Software & Source Code",
            deliverables: ["https://github.com/provizto/zoniqfi"]
          },
          {
            id: 2,
            sku: "SKU-02",
            name: "Enterprise Multi-Vendor License Key",
            desc: "Lifetime commercial license with automated on-chain settlement hooks.",
            priceEth: "0.003",
            badge: "🔑 Licenses & Digital Accounts",
            deliverables: ["https://zoniqfinance.com"]
          }
        ]);
      }
    } catch (err) {
      console.warn("Could not connect to Supabase:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const checkVendorProfile = async () => {
    if (!address) {
      setVendorProfile(null);
      return;
    }
    const walletStr = String(address).toLowerCase();
    try {
      const { data } = await supabase
        .from("vendors")
        .select("*")
        .eq("wallet_address", walletStr)
        .maybeSingle();

      if (data) {
        setVendorProfile(data);
        setVendorStoreName(data.store_name);
        setVendorEmail(data.contact_email || "");
        setVendorBank(data.payout_bank_name || "");
        setVendorAccNumber(data.payout_account_number || "");

        const { data: statsData } = await supabase
          .from("vendor_sales_summary")
          .select("*")
          .eq("vendor_wallet", walletStr)
          .maybeSingle();

        if (statsData) {
          setVendorStats({
            totalOrders: Number(statsData.total_orders) || 0,
            grossEth: Number(statsData.gross_sales_eth) || 0,
            netEth: Number(statsData.net_vendor_earnings_eth) || 0
          });
        }
      } else {
        setVendorProfile(null);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchAdminPayoutData = async () => {
    try {
      const { data: vendorsList } = await supabase.from("vendors").select("*");
      const { data: summaryList } = await supabase.from("vendor_sales_summary").select("*");

      if (vendorsList) {
        let totalFee = 0;
        const combined: AdminVendorPayoutItem[] = vendorsList.map((v: any) => {
          const matchedSummary = (summaryList || []).find(
            (s: any) => s.vendor_wallet && s.vendor_wallet.toLowerCase() === v.wallet_address.toLowerCase()
          );

          const totalOrd = Number(matchedSummary?.total_orders) || 0;
          const gross = Number(matchedSummary?.gross_sales_eth) || 0;
          const net = Number(matchedSummary?.net_vendor_earnings_eth) || 0;
          const fee = Number(matchedSummary?.platform_fee_eth) || 0;

          totalFee += fee;

          return {
            wallet_address: v.wallet_address,
            store_name: v.store_name,
            contact_email: v.contact_email,
            payout_bank_name: v.payout_bank_name,
            payout_account_number: v.payout_account_number,
            total_orders: totalOrd,
            gross_sales_eth: gross,
            net_vendor_earnings_eth: net,
            platform_fee_eth: fee
          };
        });

        setAdminPayouts(combined);
        setAdminTotalPlatformFee(totalFee);
      }
    } catch (err) {
      console.warn("Failed to fetch admin payouts:", err);
    }
  };

  const fetchAdminOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setAdminOrders(data);
      }
    } catch (err) {
      console.warn("Failed to fetch admin orders:", err);
    }
  };

  const recordOrderToSupabase = async (payload: {
    sku?: string;
    productId: number;
    vendorWallet?: string;
    buyerWallet?: string;
    buyerEmail?: string;
    priceEth: string;
    amountPaidFiat?: number;
    paymentMethod: string;
    txHash: string;
    nftTokenId: string;
  }) => {
    try {
      const { error } = await supabase.from("orders").insert([
        {
          sku: payload.sku || `SKU-0${payload.productId}`,
          vendor_wallet: payload.vendorWallet ? String(payload.vendorWallet).toLowerCase() : null,
          wallet_address: payload.buyerWallet || null,
          customer_email: payload.buyerEmail || "verified@customer.node",
          payment_method: payload.paymentMethod,
          amount_paid: Number(payload.priceEth),
          currency: "SOL",
          tx_hash: payload.txHash,
          status: "completed"
        }
      ]);

      if (error) {
        console.error("❌ Gagal simpan ke Supabase orders:", error);
      }

      checkVendorProfile();
      fetchAdminPayoutData();
      fetchAdminOrders();
    } catch (err) {
      console.error("❌ Exception saat simpan order:", err);
    }
  };

  const handleSearchLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyQuery.trim()) return;

    setIsSearchingLicense(true);
    setVerifyError("");
    setVerifiedResult(null);

    try {
      const query = verifyQuery.trim();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`tx_hash.eq.${query},customer_email.eq.${query},sku.eq.${query}`)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) {
        setVerifyError("❌ License not found in ledger database.");
      } else {
        setVerifiedResult(data[0]);
      }
    } catch {
      setVerifyError("Verification failed due to an error.");
    } finally {
      setIsSearchingLicense(false);
    }
  };

  const handleOpenEditProduct = (prod: StoreProduct) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditDesc(prod.desc);
    setEditPrice(prod.priceEth);
    setEditBadge(prod.badge || PAYFI_CATEGORY_OPTIONS[0]);
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !address) return;

    try {
      setIsUpdatingProduct(true);
      const { error } = await supabase
        .from("products")
        .update({
          title: editName,
          description: editDesc,
          price_eth: Number(editPrice) || 0.001,
          category: editBadge
        })
        .match({ sku: editingProduct.sku || `SKU-0${editingProduct.id}`, vendor_wallet: String(address).toLowerCase() });

      if (error) {
        alert("Failed to update product: " + error.message);
        return;
      }

      alert("✅ Product updated successfully!");
      setEditingProduct(null);
      fetchProductsFromSupabase();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const handleDeleteProduct = async (prod: StoreProduct) => {
    if (!address) return;
    const confirmDelete = window.confirm(`Are you sure you want to remove "${prod.name}" from storefront?`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .match({ sku: prod.sku || `SKU-0${prod.id}`, vendor_wallet: String(address).toLowerCase() });

      if (error) {
        alert("Failed to delete product: " + error.message);
        return;
      }

      alert("🗑️ Product removed from storefront!");
      fetchProductsFromSupabase();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleUpdateVendorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    try {
      setIsUpdatingVendorProfile(true);
      const walletStr = String(address).toLowerCase();

      const { data, error } = await supabase
        .from("vendors")
        .upsert(
          {
            wallet_address: walletStr,
            store_name: vendorStoreName,
            contact_email: vendorEmail,
            payout_bank_name: vendorBank,
            payout_account_number: vendorAccNumber
          },
          { onConflict: "wallet_address" }
        )
        .select()
        .single();

      if (error) {
        alert("Failed to save vendor profile: " + error.message);
        return;
      }

      setVendorProfile(data);
      setIsEditingVendorProfile(false);
      alert("✅ Vendor Profile & Payout Account updated!");
      fetchAdminPayoutData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdatingVendorProfile(false);
    }
  };

  useEffect(() => {
    fetchStoreConfigFromSupabase();
    fetchProductsFromSupabase();
    fetchAdminPayoutData();
    fetchAdminOrders();
  }, []);

  useEffect(() => {
    checkVendorProfile();
  }, [address]);

  useEffect(() => {
    localStorage.setItem("zoniq_store_config", JSON.stringify(storeConfig));
  }, [storeConfig]);

  const availableBadges = useMemo(() => {
    const list = products.map((p) => p.badge).filter(Boolean) as string[];
    return ["ALL", ...Array.from(new Set(list))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `SKU-0${prod.id}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBadge = selectedBadge === "ALL" || prod.badge === selectedBadge;
      return matchSearch && matchBadge;
    });
  }, [products, searchQuery, selectedBadge]);

  const myVendorProducts = useMemo(() => {
    if (!address) return [];
    return products.filter(
      (p) => p.vendor_wallet && p.vendor_wallet.toLowerCase() === String(address).toLowerCase()
    );
  }, [products, address]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (badge: string) => {
    setSelectedBadge(badge);
    setCurrentPage(1);
  };

  const handleOpenProduct = (prod: StoreProduct) => {
    const anyProd = prod as any;
    const cat = (anyProd.badge || anyProd.category || "").toLowerCase();
    const isPhysical = cat.includes("fashion") || cat.includes("gadget") || cat.includes("physical") || cat.includes("fisik");

    if (isPhysical) {
      const adminWa = "6285960601973";
      const message = `Hello, I'd like to order this physical item:%0A- *Product*: ${prod.name}%0A- *Price*: ${prod.priceEth} SOL%0A- *Category*: ${anyProd.badge || anyProd.category || "-"}%0A%0APlease inform me regarding stock and shipping rates.`;
      
      window.open(`https://wa.me/${adminWa}?text=${message}`, "_blank");
      return;
    }

    setSelectedProduct(prod);
    setShowCheckoutModal(true);
  };

  const handleDirectBuy = async (_id: number, priceEth: string) => {
    if (!isConnected || !publicKey) {
      setWalletModalVisible(true);
      return;
    }

    try {
      setIsTxPending(true);
      setTxError(null);
      setTxHash("");

      const lamports = Math.round(Number(priceEth) * LAMPORTS_PER_SOL);
      let recipientPubkey: PublicKey;
      try {
        if (selectedProduct?.vendor_wallet && selectedProduct.vendor_wallet.length >= 32) {
          recipientPubkey = new PublicKey(selectedProduct.vendor_wallet);
        } else {
          recipientPubkey = publicKey;
        }
      } catch {
        recipientPubkey = publicKey;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamports > 0 ? lamports : 1000,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      setIsTxPending(false);
      setIsConfirming(true);

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });

      setIsConfirming(false);
      setTxHash(signature);

      setShowCheckoutModal(false);
      const generatedTokenId = `#SOL-${Math.floor(1000 + Math.random() * 9000)}`;

      if (selectedProduct) {
        setDeliverySuccess({
          product: selectedProduct,
          txHash: signature,
          buyer: customerEmail || address,
          tokenId: generatedTokenId,
          method: "Crypto-Native Wallet (SOL Devnet)"
        });

        await recordOrderToSupabase({
          sku: `SKU-0${selectedProduct.id}`,
          productId: selectedProduct.id,
          vendorWallet: selectedProduct.vendor_wallet,
          buyerWallet: address,
          buyerEmail: customerEmail || undefined,
          priceEth: selectedProduct.priceEth,
          paymentMethod: "Crypto-Native Wallet (SOL Devnet)",
          txHash: signature,
          nftTokenId: generatedTokenId
        });
      }
    } catch (err: any) {
      setIsTxPending(false);
      setIsConfirming(false);
      setTxError(err);
      console.warn("Direct buy error:", err);
      alert("⚠️ Transaction failed: " + (err?.message || "Check connection & Devnet SOL balance!"));
    }
  };

  const executeOnChainRelayMint = () => {
    setShowQrisModal(false);
    setShowCheckoutModal(false);
    setFiatPaymentStatus("PROCESSING");

    const activeId = selectedProduct?.id || 1;

    setTimeout(async () => {
      setFiatPaymentStatus("SUCCESS");
      const mockRelayTx = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const displayHolder = customerEmail || "QRIS Verified Buyer";
      const relayTokenId = `#RELAY-SOL-0${activeId}`;
      const methodStr = "IDR QRIS Instant";

      if (selectedProduct) {
        setDeliverySuccess({
          product: selectedProduct,
          txHash: mockRelayTx,
          buyer: displayHolder,
          tokenId: relayTokenId,
          method: methodStr
        });

        await recordOrderToSupabase({
          sku: `SKU-0${selectedProduct.id}`,
          productId: selectedProduct.id,
          vendorWallet: selectedProduct.vendor_wallet,
          buyerEmail: customerEmail || undefined,
          priceEth: selectedProduct.priceEth,
          amountPaidFiat: calculatedIdrPrice,
          paymentMethod: methodStr,
          txHash: mockRelayTx,
          nftTokenId: relayTokenId
        });
      }
    }, 1200);
  };

  const handleVendorUploadProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !vendorProfile) {
      alert("Please register as a vendor first!");
      return;
    }

    try {
      setIsSubmittingProduct(true);
      let finalDownloadUrl = newProductDeliverable;

      if (productFile) {
        const fileExt = productFile.name.split(".").pop();
        const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `vendor-files/${cleanFileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("digital-assets")
          .upload(filePath, productFile);

        if (uploadErr) {
          alert("Failed to upload file: " + uploadErr.message);
          setIsSubmittingProduct(false);
          return;
        }

        const { data: signedData } = await supabase.storage
          .from("digital-assets")
          .createSignedUrl(filePath, 60 * 60 * 24 * 365);

        finalDownloadUrl = signedData?.signedUrl || filePath;
      }

      const deliverablesList = finalDownloadUrl
        ? finalDownloadUrl.split(",").map((s) => s.trim())
        : ["Full Digital Package Access"];

      const nextSku = `SKU-0${products.length + 1}`;

      const { error } = await supabase.from("products").insert([
        {
          sku: nextSku,
          vendor_wallet: String(address).toLowerCase(),
          title: newProductName,
          description: newProductDesc,
          price_eth: Number(newProductPrice) || 0.001,
          category: newProductBadge || PAYFI_CATEGORY_OPTIONS[0],
          download_url: deliverablesList[0] || "https://zoniqfinance.com"
        }
      ]);

      if (error) {
        alert("Failed to upload product: " + error.message);
        return;
      }

      alert("✅ Product & digital files successfully published to storefront!");
      setNewProductName("");
      setNewProductDesc("");
      setNewProductDeliverable("");
      setProductFile(null);
      fetchProductsFromSupabase();
      setVendorActiveTab("PRODUCTS");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === storeConfig.adminPin) {
      setShowPinModal(false);
      setInputPin("");
      setTempConfig(storeConfig);
      fetchAdminPayoutData();
      fetchAdminOrders();
      setIsEditModalOpen(true);
    } else {
      alert("❌ Invalid PIN! Access Denied.");
    }
  };

  const handleQrisImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempConfig((prev) => ({
          ...prev,
          customQrImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStoreConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase
        .from("platform_settings")
        .upsert({
          id: "main_config",
          config: tempConfig,
          updated_at: new Date().toISOString()
        });

      setStoreConfig(tempConfig);
      localStorage.setItem("zoniq_store_config", JSON.stringify(tempConfig));
      setIsEditModalOpen(false);
      alert("✅ Platform settings & QRIS saved to Cloud!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const triggerDownloadDeliverables = (prod: StoreProduct) => {
    const content = `=========================================================\n` +
      `ZONIQFI DIGITAL COMMERCE - OFFICIAL LICENSE CERTIFICATE\n` +
      `=========================================================\n\n` +
      `Product Name  : ${prod.name}\n` +
      `SKU Code      : ${prod.sku || `SKU-0${prod.id}`}\n` +
      `Price Paid    : ${prod.priceEth} SOL / Equivalent Fiat\n` +
      `Vendor Wallet : ${prod.vendor_wallet || "Platform Core"}\n` +
      `Licensee Email: ${customerEmail || "Connected Solana Holder"}\n` +
      `Timestamp     : ${new Date().toISOString()}\n\n` +
      `DELIVERABLES & ACCESS CREDENTIALS:\n` +
      (prod.deliverables ? prod.deliverables.map((d, i) => `[${i + 1}] ${d}`).join("\n") : "Full digital package") +
      `\n\nACCESS LINKS:\n` +
      `- Main Repo / File Access: ${prod.deliverables?.[0] || "https://zoniqfinance.com"}\n` +
      `- Community Support       : https://t.me/zoniqfi_core\n` +
      `- Solana Cluster Node     : Devnet Cluster\n\n` +
      `Thank you for your purchase!`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ZONIQFI-LICENSE-${prod.sku || `SKU0${prod.id}`}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: "780px",
      margin: "0 auto",
      background: "#0c1322",
      border: "1px solid #1e293b",
      borderRadius: "20px",
      padding: isMobile ? "16px 12px" : "22px 20px",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.45)",
      boxSizing: "border-box",
      color: "#f3f4f6",
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      
      {/* 🔍 MODAL PUBLIC LICENSE VERIFIER */}
      {showVerifyModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999999, padding: "16px" }}>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "24px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#38bdf8" }}>🔍 Public License Verifier</h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#94a3b8" }}>Verify digital license validity & on-chain proof of ownership</p>
              </div>
              <button type="button" onClick={() => { setShowVerifyModal(false); setVerifiedResult(null); setVerifyError(""); }} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSearchLicense} style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="Enter Tx Hash / Email / SKU..."
                value={verifyQuery}
                onChange={(e) => setVerifyQuery(e.target.value)}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "12px", boxSizing: "border-box" }}
                required
              />
              <button type="submit" disabled={isSearchingLicense} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
                {isSearchingLicense ? "Verifying..." : "Verify"}
              </button>
            </form>

            {verifyError && (
              <div style={{ background: "#7f1d1d30", border: "1px solid #ef4444", padding: "12px", borderRadius: "10px", color: "#fca5a5", fontSize: "12px", textAlign: "center" }}>
                {verifyError}
              </div>
            )}

            {verifiedResult && (
              <div style={{ background: "#062319", border: "2px solid #10b981", borderRadius: "12px", padding: "16px", fontSize: "11px", color: "#cbd5e1" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "16px" }}>✅</span>
                  <strong style={{ color: "#34d399", fontSize: "13px" }}>OFFICIAL VERIFIED LICENSE</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#94a3b8" }}>Product SKU:</span>
                  <strong style={{ color: "#fff" }}>{verifiedResult.sku}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#94a3b8" }}>Licensee:</span>
                  <strong style={{ color: "#38bdf8" }}>{verifiedResult.customer_email || "Verified Holder"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#94a3b8" }}>Payment Gateway:</span>
                  <strong style={{ color: "#60a5fa" }}>{verifiedResult.payment_method}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#94a3b8" }}>Timestamp:</span>
                  <strong>{new Date(verifiedResult.created_at).toLocaleString()}</strong>
                </div>
                <div style={{ borderTop: "1px solid #065f46", paddingTop: "6px", marginTop: "6px", wordBreak: "break-all" }}>
                  <span style={{ color: "#6ee7b7" }}>On-chain Tx Signature: </span>
                  <code style={{ color: "#34d399" }}>{verifiedResult.tx_hash}</code>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✏️ MODAL EDIT PRODUK VENDOR */}
      {editingProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999999, padding: "16px" }}>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "18px", padding: "24px", width: "100%", maxWidth: "500px", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #1f2937", paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#38bdf8" }}>✏️ Edit Product: {editingProduct.sku || `SKU-0${editingProduct.id}`}</h3>
              <button type="button" onClick={() => setEditingProduct(null)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleSaveEditProduct} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Product Title:</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Price (SOL):</label>
                  <input type="text" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} style={{ width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Category / Badge:</label>
                  <select
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "9px",
                      borderRadius: "6px",
                      border: "1px solid #374151",
                      background: "#0b0f19",
                      color: "#ffffff",
                      fontSize: "12px",
                      boxSizing: "border-box",
                      cursor: "pointer"
                    }}
                    required
                  >
                    {PAYFI_CATEGORY_OPTIONS.map((cat, idx) => (
                      <option key={idx} value={cat} style={{ background: "#0b0f19", color: "#fff" }}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Description:</label>
                <textarea rows={3} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} style={{ width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "12px", resize: "none", boxSizing: "border-box" }} required />
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button type="button" onClick={() => setEditingProduct(null)} style={{ width: "35%", background: "#374151", color: "#cbd5e1", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>Cancel</button>
                <button type="submit" disabled={isUpdatingProduct} style={{ width: "65%", background: "#10b981", color: "#ffffff", border: "none", padding: "10px", borderRadius: "6px", cursor: isUpdatingProduct ? "not-allowed" : "pointer", fontWeight: 800, fontSize: "12px" }}>
                  {isUpdatingProduct ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🚀 MODAL PORTAL VENDOR */}
      {showVendorModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999997, padding: "16px" }}>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "24px", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #1f2937", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#fff" }}>{t.vendorModalTitle}</h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#94a3b8" }}>Manage storefront, monitor revenue, and configure payout accounts</p>
              </div>
              <button type="button" onClick={() => setShowVendorModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}>✕</button>
            </div>

            {!isConnected ? (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <p style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "16px" }}>Connect your Solana Web3 wallet to manage or launch your storefront.</p>
                <button type="button" onClick={() => { setShowVendorModal(false); setWalletModalVisible(true); }} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>{t.connectWallet}</button>
              </div>
            ) : !vendorProfile ? (
              <form onSubmit={handleUpdateVendorProfile} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "12px", borderRadius: "10px", fontSize: "11px", color: "#94a3b8" }}>
                  Active Wallet: <strong style={{ color: "#38bdf8" }}>{walletAddressStr}</strong>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: "4px" }}>Store / Brand Name:</label>
                  <input type="text" placeholder="e.g. Provizto Digital Labs" value={vendorStoreName} onChange={(e) => setVendorStoreName(e.target.value)} style={{ width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #374151", background: "#0f172a", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: "4px" }}>Notification Email:</label>
                  <input type="email" placeholder="vendor@domain.com" value={vendorEmail} onChange={(e) => setVendorEmail(e.target.value)} style={{ width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #374151", background: "#0f172a", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: "4px" }}>Payout Bank / E-Wallet (IDR):</label>
                    <input type="text" placeholder="BCA / Mandiri / GoPay / DANA" value={vendorBank} onChange={(e) => setVendorBank(e.target.value)} style={{ width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #374151", background: "#0f172a", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: "4px" }}>Payout Account Number:</label>
                    <input type="text" placeholder="1234567890" value={vendorAccNumber} onChange={(e) => setVendorAccNumber(e.target.value)} style={{ width: "100%", padding: "9px", borderRadius: "6px", border: "1px solid #374151", background: "#0f172a", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} required />
                  </div>
                </div>
                <button type="submit" disabled={isUpdatingVendorProfile} style={{ width: "100%", background: "#10b981", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: 800, fontSize: "13px", cursor: isUpdatingVendorProfile ? "not-allowed" : "pointer", marginTop: "8px" }}>
                  {isUpdatingVendorProfile ? "Registering..." : "🚀 Launch Store & Activate Vendor Profile"}
                </button>
              </form>
            ) : (
              <div>
                <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "12px", borderRadius: "10px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#34d399" }}>🏪 {vendorProfile.store_name}</span>
                    <span style={{ display: "block", fontSize: "10px", color: "#94a3b8" }}>{walletAddressStr.slice(0, 6)}...{walletAddressStr.slice(-4)}</span>
                  </div>
                  <span style={{ fontSize: "10px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "4px 8px", borderRadius: "6px", fontWeight: 700 }}>Verified Merchant</span>
                </div>

                <div style={{ display: "flex", gap: "6px", marginBottom: "16px", background: "#0b0f19", padding: "4px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <button type="button" onClick={() => setVendorActiveTab("STATS")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", background: vendorActiveTab === "STATS" ? "#2563eb" : "transparent", color: vendorActiveTab === "STATS" ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
                    📊 Revenue & Payout
                  </button>
                  <button type="button" onClick={() => setVendorActiveTab("UPLOAD")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", background: vendorActiveTab === "UPLOAD" ? "#2563eb" : "transparent", color: vendorActiveTab === "UPLOAD" ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
                    ➕ Add Product
                  </button>
                  <button type="button" onClick={() => setVendorActiveTab("PRODUCTS")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", background: vendorActiveTab === "PRODUCTS" ? "#2563eb" : "transparent", color: vendorActiveTab === "PRODUCTS" ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
                    📦 My Inventory ({myVendorProducts.length})
                  </button>
                </div>

                {vendorActiveTab === "STATS" && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                      <div style={{ background: "#0b1329", border: "1px solid #1e3a8a", padding: "14px", borderRadius: "10px" }}>
                        <span style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Completed Orders</span>
                        <h4 style={{ margin: "6px 0 0 0", fontSize: "20px", fontWeight: 800, color: "#60a5fa" }}>{vendorStats.totalOrders} Orders</h4>
                      </div>
                      <div style={{ background: "#062319", border: "1px solid #065f46", padding: "14px", borderRadius: "10px" }}>
                        <span style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Net Earnings (95%)</span>
                        <h4 style={{ margin: "6px 0 0 0", fontSize: "18px", fontWeight: 800, color: "#34d399" }}>{vendorStats.netEth.toFixed(4)} SOL</h4>
                        <span style={{ fontSize: "10px", color: "#6ee7b7" }}>≈ Rp {Math.round(vendorStats.netEth * (storeConfig.rateIdr || 54000000)).toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "14px", borderRadius: "10px", fontSize: "11px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <span style={{ fontWeight: 700, color: "#38bdf8" }}>💳 Merchant Payout Bank & E-Wallet:</span>
                        <button
                          type="button"
                          onClick={() => setIsEditingVendorProfile(!isEditingVendorProfile)}
                          style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", cursor: "pointer", fontWeight: 700 }}
                        >
                          {isEditingVendorProfile ? "Cancel" : "✏️ Edit Account"}
                        </button>
                      </div>

                      {isEditingVendorProfile ? (
                        <form onSubmit={handleUpdateVendorProfile} style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>Store Name:</label>
                            <input type="text" value={vendorStoreName} onChange={(e) => setVendorStoreName(e.target.value)} style={{ width: "100%", padding: "7px", borderRadius: "5px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>Notification Email:</label>
                            <input type="email" value={vendorEmail} onChange={(e) => setVendorEmail(e.target.value)} style={{ width: "100%", padding: "7px", borderRadius: "5px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>Bank / E-Wallet:</label>
                              <input type="text" placeholder="BCA / DANA / GoPay" value={vendorBank} onChange={(e) => setVendorBank(e.target.value)} style={{ width: "100%", padding: "7px", borderRadius: "5px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>Account Number:</label>
                              <input type="text" placeholder="1234567890" value={vendorAccNumber} onChange={(e) => setVendorAccNumber(e.target.value)} style={{ width: "100%", padding: "7px", borderRadius: "5px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                            </div>
                          </div>
                          <button type="submit" disabled={isUpdatingVendorProfile} style={{ width: "100%", background: "#10b981", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", fontWeight: 700, fontSize: "11px", cursor: isUpdatingVendorProfile ? "not-allowed" : "pointer", marginTop: "4px" }}>
                            {isUpdatingVendorProfile ? "Saving..." : "💾 Save Account Changes"}
                          </button>
                        </form>
                      ) : (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1", marginBottom: "4px" }}>
                            <span>Bank / E-Wallet:</span>
                            <strong style={{ color: "#fff" }}>{vendorProfile.payout_bank_name || "Not configured"}</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1", marginBottom: "4px" }}>
                            <span>Account Number:</span>
                            <strong style={{ color: "#34d399" }}>{vendorProfile.payout_account_number || "Not configured"}</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                            <span>Contact Email:</span>
                            <strong style={{ color: "#38bdf8" }}>{vendorProfile.contact_email || "-"}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {vendorActiveTab === "UPLOAD" && (
                  <form onSubmit={handleVendorUploadProduct} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", color: "#cbd5e1", marginBottom: "3px" }}>Product Title / License Name:</label>
                        <input type="text" placeholder="e.g. Solana PayFi Full Source Code" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", color: "#cbd5e1", marginBottom: "3px" }}>Price (SOL):</label>
                        <input type="text" placeholder="0.003" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", color: "#cbd5e1", marginBottom: "3px" }}>Category / Badge:</label>
                        <select
                          value={newProductBadge}
                          onChange={(e) => setNewProductBadge(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #374151",
                            background: "#0b0f19",
                            color: "#fff",
                            fontSize: "11px",
                            boxSizing: "border-box",
                            cursor: "pointer"
                          }}
                          required
                        >
                          {PAYFI_CATEGORY_OPTIONS.map((cat, idx) => (
                            <option key={idx} value={cat} style={{ background: "#0b0f19", color: "#fff" }}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", color: "#cbd5e1", marginBottom: "3px" }}>External Access Link (Optional):</label>
                        <input type="text" placeholder="GitHub access repo, video course, etc." value={newProductDeliverable} onChange={(e) => setNewProductDeliverable(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} />
                      </div>
                    </div>

                    <div style={{ background: "#0f172a", padding: "10px", borderRadius: "8px", border: "1px dashed #38bdf8" }}>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#38bdf8", marginBottom: "4px" }}>
                        📁 Upload Master Asset File (.ZIP / .PDF / .RAR):
                      </label>
                      <input 
                        type="file" 
                        onChange={(e) => setProductFile(e.target.files?.[0] || null)} 
                        style={{ width: "100%", fontSize: "10px", color: "#94a3b8" }} 
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#cbd5e1", marginBottom: "3px" }}>Detailed Description:</label>
                      <textarea rows={3} placeholder="Explain license terms, deliverables, and features..." value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #374151", background: "#0b0f19", color: "#fff", fontSize: "11px", resize: "none", boxSizing: "border-box" }} required />
                    </div>

                    <button type="submit" disabled={isSubmittingProduct} style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", padding: "11px", borderRadius: "8px", fontWeight: 800, fontSize: "12px", cursor: isSubmittingProduct ? "not-allowed" : "pointer" }}>
                      {isSubmittingProduct ? "Uploading to Cloud..." : "🚀 Publish Product to Storefront"}
                    </button>
                  </form>
                )}

                {vendorActiveTab === "PRODUCTS" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
                    {myVendorProducts.length === 0 ? (
                      <p style={{ textAlign: "center", color: "#64748b", fontSize: "12px", padding: "20px" }}>You haven't uploaded any products yet.</p>
                    ) : (
                      myVendorProducts.map((p) => (
                        <div key={p.id} style={{ background: "#0b0f19", border: "1px solid #1e293b", padding: "12px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <strong style={{ fontSize: "13px", color: "#fff" }}>{p.name}</strong>
                              <span style={{ fontSize: "9px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>{p.badge}</span>
                            </div>
                            <span style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{p.sku || `SKU-0${p.id}`} • <strong style={{ color: "#34d399" }}>{p.priceEth} SOL</strong></span>
                          </div>

                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(p)}
                              style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: 700 }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p)}
                              style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: 700 }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔐 MODAL PIN ADMIN */}
      {showPinModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999999 }}>
          <div style={{ backgroundColor: "#111827", padding: "26px", borderRadius: "16px", width: "90%", maxWidth: "340px", textAlign: "center", border: "1px solid #1f2937", color: "#fff" }}>
            <div style={{ fontSize: "28px", marginBottom: "6px" }}>🔑</div>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: 800 }}>{t.adminPinTitle}</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "11px", color: "#94a3b8" }}>{t.adminPinSub}</p>
            <form onSubmit={handleVerifyPin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="password"
                maxLength={6}
                placeholder={t.adminPinPlaceholder}
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #374151", background: "#1f2937", color: "#fff", textAlign: "center", fontSize: "16px", fontWeight: 800, letterSpacing: "0.2em", boxSizing: "border-box" }}
                required
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => { setShowPinModal(false); setInputPin(""); }} style={{ width: "40%", background: "#374151", color: "#cbd5e1", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>{t.cancel}</button>
                <button type="submit" style={{ width: "60%", background: "#2563eb", color: "#ffffff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}>{t.adminPinSubmit}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🛠️ MODAL EDIT ADMIN */}
      {isEditModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999998 }}>
          <div style={{ backgroundColor: "#111827", padding: "26px", borderRadius: "18px", width: "95%", maxWidth: "760px", maxHeight: "90vh", overflowY: "auto", textAlign: "left", border: "1px solid #1f2937", color: "#f3f4f6" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#fff" }}>{t.adminModalTitle}</h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#34d399" }}>● Supabase Enterprise Live Engine</p>
              </div>
              <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>

            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", background: "#0b0f19", padding: "4px", borderRadius: "8px", border: "1px solid #1e293b", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setAdminActiveTab("SETTINGS")} style={{ flex: 1, minWidth: "120px", padding: "8px", borderRadius: "6px", border: "none", background: adminActiveTab === "SETTINGS" ? "#2563eb" : "transparent", color: adminActiveTab === "SETTINGS" ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
                ⚙️ Setelan Toko & FX
              </button>
              <button type="button" onClick={() => { fetchAdminPayoutData(); setAdminActiveTab("PAYOUTS"); }} style={{ flex: 1, minWidth: "140px", padding: "8px", borderRadius: "6px", border: "none", background: adminActiveTab === "PAYOUTS" ? "#2563eb" : "transparent", color: adminActiveTab === "PAYOUTS" ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
                💸 Rekonsiliasi Vendor ({adminPayouts.length})
              </button>
              <button type="button" onClick={() => { fetchAdminOrders(); setAdminActiveTab("ORDERS"); }} style={{ flex: 1, minWidth: "140px", padding: "8px", borderRadius: "6px", border: "none", background: adminActiveTab === "ORDERS" ? "#2563eb" : "transparent", color: adminActiveTab === "ORDERS" ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
                📋 Riwayat Pesanan ({adminOrders.length})
              </button>
            </div>

            {adminActiveTab === "SETTINGS" && (
              <form onSubmit={handleSaveStoreConfig} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94a3b8", marginBottom: "4px" }}>{t.storeNameLabel}</label>
                    <input type="text" value={tempConfig.storeName} onChange={(e) => setTempConfig({ ...tempConfig, storeName: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #374151", background: "#1f2937", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#94a3b8", marginBottom: "4px" }}>{t.storeSubtitleLabel}</label>
                    <input type="text" value={tempConfig.storeSubtitle} onChange={(e) => setTempConfig({ ...tempConfig, storeSubtitle: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #374151", background: "#1f2937", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} required />
                  </div>
                </div>

                <div style={{ background: "#0b1728", padding: "14px", borderRadius: "10px", border: "1px solid #1e3a8a" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>
                    🏦 Rekening Resmi Admin (Penerima Laba 5% Platform & Penampung Dana)
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#cbd5e1", marginBottom: "3px" }}>Nama Bank / E-Wallet:</label>
                      <input type="text" placeholder="BCA / Mandiri / GoPay" value={tempConfig.adminBankName || ""} onChange={(e) => setTempConfig({ ...tempConfig, adminBankName: e.target.value })} style={{ width: "100%", padding: "7px", borderRadius: "5px", border: "1px solid #374151", background: "#111827", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#cbd5e1", marginBottom: "3px" }}>Nomor Rekening Asli:</label>
                      <input type="text" placeholder="1234567890" value={tempConfig.adminAccountNumber || ""} onChange={(e) => setTempConfig({ ...tempConfig, adminAccountNumber: e.target.value })} style={{ width: "100%", padding: "7px", borderRadius: "5px", border: "1px solid #374151", background: "#111827", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#cbd5e1", marginBottom: "3px" }}>Atas Nama Pemilik:</label>
                      <input type="text" placeholder="Nama Lengkap Admin" value={tempConfig.adminAccountHolder || ""} onChange={(e) => setTempConfig({ ...tempConfig, adminAccountHolder: e.target.value })} style={{ width: "100%", padding: "7px", borderRadius: "5px", border: "1px solid #374151", background: "#111827", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                    </div>
                  </div>
                </div>

                <div style={{ background: "#0f172a", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>{t.fxRateHeading}</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#94a3b8", marginBottom: "3px" }}>{t.rateIdrLabel}</label>
                      <input type="number" value={tempConfig.rateIdr} onChange={(e) => setTempConfig({ ...tempConfig, rateIdr: Number(e.target.value) })} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #374151", background: "#1f2937", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#94a3b8", marginBottom: "3px" }}>{t.rateUsdLabel}</label>
                      <input type="number" value={tempConfig.rateUsd} onChange={(e) => setTempConfig({ ...tempConfig, rateUsd: Number(e.target.value) })} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #374151", background: "#1f2937", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#94a3b8", marginBottom: "3px" }}>{t.pinLabel}</label>
                      <input type="password" maxLength={6} value={tempConfig.adminPin} onChange={(e) => setTempConfig({ ...tempConfig, adminPin: e.target.value })} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #374151", background: "#1f2937", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} required />
                    </div>
                  </div>
                </div>

                <div style={{ background: "#1e1b4b", padding: "12px", borderRadius: "8px", border: "1px solid #312e81" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#a5b4fc", textTransform: "uppercase" }}>{t.qrisSectionTitle}</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#cbd5e1", marginBottom: "3px" }}>{t.qrisUploadLabel}</label>
                      <input type="file" accept="image/*" onChange={handleQrisImageUpload} style={{ width: "100%", fontSize: "10px", padding: "4px", background: "#0f172a", border: "1px solid #374151", borderRadius: "4px", boxSizing: "border-box", color: "#cbd5e1" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#cbd5e1", marginBottom: "3px" }}>{t.qrisStringLabel}</label>
                      <input type="text" placeholder="0002010102112667..." value={tempConfig.customQrisCode || ""} onChange={(e) => setTempConfig({ ...tempConfig, customQrisCode: e.target.value })} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #374151", background: "#0f172a", color: "#fff", fontSize: "11px", boxSizing: "border-box" }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button type="button" onClick={() => setTempConfig(DEFAULT_CONFIG)} style={{ width: "30%", background: "#374151", color: "#cbd5e1", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}>{t.resetDefault}</button>
                  <button type="submit" style={{ width: "70%", background: "#10b981", color: "#ffffff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: 800, fontSize: "12px" }}>{t.saveStore}</button>
                </div>
              </form>
            )}

            {adminActiveTab === "PAYOUTS" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ background: "#062319", border: "1px solid #065f46", padding: "14px", borderRadius: "10px" }}>
                    <span style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Total Laba Bersih Platform (5%)</span>
                    <h4 style={{ margin: "4px 0 0 0", fontSize: "18px", fontWeight: 800, color: "#34d399" }}>{adminTotalPlatformFee.toFixed(4)} SOL</h4>
                    <span style={{ fontSize: "11px", color: "#6ee7b7", display: "block", marginTop: "2px" }}>
                      ≈ Rp {Math.round(adminTotalPlatformFee * (storeConfig.rateIdr || 54000000)).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div style={{ background: "#0b1728", border: "1px solid #1e3a8a", padding: "14px", borderRadius: "10px", fontSize: "11px" }}>
                    <span style={{ fontSize: "10px", color: "#38bdf8", textTransform: "uppercase", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                      🏦 Rekening Penerima Keuntungan Admin:
                    </span>
                    <div style={{ color: "#fff", fontWeight: 700 }}>
                      {storeConfig.adminBankName || "BCA"} — <code style={{ color: "#38bdf8" }}>{storeConfig.adminAccountNumber || "Belum diisi"}</code>
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "10px", marginTop: "2px" }}>
                      a.n. {storeConfig.adminAccountHolder || "Admin Utama"}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto" }}>
                  {adminPayouts.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#64748b", fontSize: "12px", padding: "20px" }}>Belum ada vendor terdaftar.</p>
                  ) : (
                    adminPayouts.map((v, idx) => (
                      <div key={idx} style={{ background: "#0b0f19", border: "1px solid #1e293b", padding: "12px 14px", borderRadius: "10px", fontSize: "11px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <div>
                            <strong style={{ fontSize: "13px", color: "#fff" }}>🏪 {v.store_name}</strong>
                            <span style={{ display: "block", fontSize: "10px", color: "#64748b" }}>{v.wallet_address}</span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ color: "#38bdf8", fontWeight: 800, fontSize: "12px" }}>{v.net_vendor_earnings_eth.toFixed(4)} SOL</span>
                            <span style={{ display: "block", fontSize: "10px", color: "#94a3b8" }}>{v.total_orders} Pesanan Terjual</span>
                          </div>
                        </div>

                        <div style={{ background: "#0f172a", padding: "8px 10px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", border: "1px solid #1e293b" }}>
                          <span style={{ color: "#cbd5e1" }}>
                            Rekening Vendor: <strong>{v.payout_bank_name || "-"}</strong> — <code style={{ color: "#34d399" }}>{v.payout_account_number || "Belum diisi"}</code>
                          </span>
                          {v.payout_account_number && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(v.payout_account_number || "");
                                alert(`Nomor rekening vendor (${v.payout_account_number}) berhasil disalin!`);
                              }}
                              style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "3px 8px", borderRadius: "4px", fontSize: "10px", cursor: "pointer", fontWeight: 600 }}
                            >
                              Salin No Rek Vendor
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {adminActiveTab === "ORDERS" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Menampilkan 50 transaksi pembelian terakhir:</span>
                  <button
                    type="button"
                    onClick={fetchAdminOrders}
                    style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "4px 10px", borderRadius: "6px", fontSize: "10px", cursor: "pointer", fontWeight: 600 }}
                  >
                    🔄 Refresh Data
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                  {adminOrders.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#64748b", fontSize: "12px", padding: "20px" }}>Belum ada riwayat pesanan masuk.</p>
                  ) : (
                    adminOrders.map((ord: any, idx: number) => (
                      <div key={idx} style={{ background: "#0b0f19", border: "1px solid #1e293b", padding: "12px", borderRadius: "10px", fontSize: "11px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <div>
                            <span style={{ fontWeight: 800, color: "#60a5fa", background: "rgba(59, 130, 246, 0.15)", padding: "2px 6px", borderRadius: "4px", marginRight: "6px" }}>
                              {ord.sku || "PROD"}
                            </span>
                            <strong style={{ color: "#fff" }}>{ord.customer_email || "Verified Holder"}</strong>
                          </div>
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                            {new Date(ord.created_at).toLocaleString("id-ID")}
                          </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1", marginTop: "4px" }}>
                          <span>Metode: <strong style={{ color: "#38bdf8" }}>{ord.payment_method}</strong></span>
                          <span>Nominal: <strong style={{ color: "#34d399" }}>{ord.amount_paid} {ord.currency || "SOL"}</strong></span>
                        </div>

                        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "6px", marginTop: "6px", wordBreak: "break-all", fontSize: "10px", color: "#64748b" }}>
                          Tx Signature:
                          <code
                            style={{
                              display: "block",
                              background: "#090d16",
                              color: "#94a3b8",
                              border: "1px solid #1e293b",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              marginTop: "6px",
                              fontFamily: "monospace",
                              fontSize: "12px",
                              wordBreak: "break-all"
                            }}
                          >
                            {ord.tx_hash || "On-chain Verified"}
                          </code>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 🎉 MODAL SUKSES LISENSI */}
      {deliverySuccess && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999999, padding: "16px" }}>
          <div style={{ backgroundColor: "#111827", border: "2px solid #10b981", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "480px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.4)" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎉</div>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 800, color: "#34d399" }}>{t.deliverySuccessTitle}</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#94a3b8" }}>{t.deliverySuccessSub}</p>

            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "14px", textAlign: "left", fontSize: "11px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#94a3b8" }}>Product:</span>
                <strong style={{ color: "#fff" }}>{deliverySuccess.product.name}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#94a3b8" }}>NFT Token ID:</span>
                <strong style={{ color: "#38bdf8" }}>{deliverySuccess.tokenId}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#94a3b8" }}>Gateway:</span>
                <strong style={{ color: "#60a5fa" }}>{deliverySuccess.method}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#94a3b8" }}>Recipient / Email:</span>
                <strong style={{ color: "#cbd5e1" }}>{deliverySuccess.buyer}</strong>
              </div>
              <div style={{ borderTop: "1px solid #1e293b", paddingTop: "6px", marginTop: "6px", wordBreak: "break-all" }}>
                <span style={{ color: "#64748b" }}>Tx Signature: </span>
                <code style={{ color: "#34d399" }}>{deliverySuccess.txHash}</code>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerDownloadDeliverables(deliverySuccess.product)}
              style={{ width: "100%", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "14px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 800, fontSize: "13px", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)", marginBottom: "10px" }}
            >
              {t.downloadAssetBtn}
            </button>

            <button
              type="button"
              onClick={() => setDeliverySuccess(null)}
              style={{ width: "100%", background: "#1e293b", color: "#94a3b8", padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🛍️ POP-UP CHECKOUT PRODUK */}
      {showCheckoutModal && selectedProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999995, padding: "16px" }}>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "20px", padding: "24px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)" }}>
            
            <div style={{ borderBottom: "1px solid #1f2937", paddingBottom: "14px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#60a5fa", background: "rgba(59, 130, 246, 0.15)", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                  {t.checkoutTag}: {selectedProduct.sku || `SKU-0${selectedProduct.id}`}
                </span>
                <h3 style={{ margin: "8px 0 3px 0", fontSize: "18px", fontWeight: 800, color: "#fff" }}>{selectedProduct.name}</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                  {selectedProduct.desc}
                </p>
                {selectedProduct.vendor_wallet && (
                  <span style={{ fontSize: "10px", color: "#34d399", marginTop: "4px", display: "inline-block" }}>
                    🏬 Creator: {selectedProduct.vendor_wallet.slice(0, 8)}...{selectedProduct.vendor_wallet.slice(-6)}
                  </span>
                )}
              </div>
              <button type="button" onClick={() => setShowCheckoutModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer", padding: "4px 8px" }}>✕</button>
            </div>

            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#38bdf8", marginBottom: "6px" }}>
                {t.emailLabel}
              </label>
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #374151", fontSize: "12px", boxSizing: "border-box", background: "#111827", color: "#fff", outline: "none" }}
              />
            </div>

            {selectedProduct.deliverables && (
              <div style={{ background: "#0b0f19", border: "1px solid #1e293b", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px" }}>
                <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: 800, textTransform: "uppercase" }}>Included Deliverables:</span>
                <ul style={{ margin: "6px 0 0 0", paddingLeft: "16px", fontSize: "11px", color: "#cbd5e1", lineHeight: "1.5" }}>
                  {selectedProduct.deliverables.map((item, idx) => {
                    const isUrl = item.startsWith("http://") || item.startsWith("https://");
                    const label = isUrl ? "📁 Master Digital Asset Access (Delivered upon confirmation)" : item;
                    return <li key={idx}>{label}</li>;
                  })}
                </ul>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ border: "1px solid #1e3a8a", background: "#0b1329", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#60a5fa" }}>⚡ {t.method1Title}</span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#38bdf8" }}>{activeEthPrice} SOL</span>
                </div>
                <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "#94a3b8" }}>{t.method1Desc}</p>
                <button
                  type="button"
                  onClick={() => {
                    if (!validateCustomerEmail()) return;
                    if (!isConnected) setWalletModalVisible(true);
                    else handleDirectBuy(selectedProduct.id, activeEthPrice);
                  }}
                  disabled={isTxPending || isConfirming}
                  style={{ width: "100%", background: (isTxPending || isConfirming) ? "#334155" : isConnected ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "#1e293b", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: (isTxPending || isConfirming) ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "12px" }}
                >
                  {isTxPending ? t.method1BtnPending : isConfirming ? t.method1BtnConfirming : isConnected ? t.method1BtnBuy(activeEthPrice) : t.connectWallet}
                </button>
              </div>

              <div style={{ border: "1px solid #065f46", background: "#062319", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#34d399" }}>📱 {t.method2Title}</span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#34d399" }}>Rp {calculatedIdrPrice.toLocaleString("id-ID")}</span>
                </div>
                <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "#6ee7b7" }}>{t.method2Desc}</p>
                <button
                  type="button"
                  onClick={() => {
                    if (!validateCustomerEmail()) return;
                    setSelectedCurrency("IDR");
                    setShowQrisModal(true);
                  }}
                  disabled={fiatPaymentStatus === "PROCESSING"}
                  style={{ width: "100%", background: "#10b981", color: "white", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}
                >
                  {t.method2BtnPay}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📱 MODAL TAMPILAN QRIS */}
      {showQrisModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999998, padding: "16px" }}>
          <div style={{ backgroundColor: "#111827", padding: "24px", borderRadius: "18px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", textAlign: "center", border: "1px solid #065f46", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#34d399" }}>📱 Scan QRIS Pembayaran</h3>
              <button type="button" onClick={() => setShowQrisModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>
            
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#cbd5e1", fontWeight: 600 }}>{selectedProduct?.name}</p>
            <h4 style={{ margin: "0 0 14px 0", fontSize: "22px", fontWeight: 800, color: "#10b981" }}>
              Rp {calculatedIdrPrice.toLocaleString("id-ID")}
            </h4>

            <div style={{ background: "#ffffff", padding: "14px", borderRadius: "14px", display: "inline-flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "340px", boxSizing: "border-box", margin: "0 auto 14px auto" }}>
              <img
                src={storeConfig.customQrImage || fallbackQrisUrl}
                alt="Barcode QRIS"
                style={{ width: "100%", height: "auto", maxHeight: "380px", display: "block", objectFit: "contain" }}
              />
            </div>

            <p style={{ margin: "0 0 16px 0", fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>
              Scan through BCA, Mandiri, GoPay, OVO, DANA, or ShopeePay to complete purchase.
            </p>

            <button
              type="button"
              onClick={executeOnChainRelayMint}
              style={{ width: "100%", background: "#10b981", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: 800, fontSize: "13px", cursor: "pointer", marginBottom: "8px" }}
            >
              ✅ I Have Completed Payment
            </button>

            <button
              type="button"
              onClick={() => setShowQrisModal(false)}
              style={{ width: "100%", background: "#1f2937", color: "#cbd5e1", border: "none", padding: "10px", borderRadius: "8px", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🎨 CSS RESPONSIF HEADER & DOCK & SCROLLBAR */}
      <style>{`
        .nav-desktop-only { display: inline-flex !important; }
        .nav-mobile-dock { display: flex !important; }
        @media (max-width: 768px) {
          .nav-desktop-only { display: none !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-dock { display: none !important; }
        }

        .payfi-product-scrollbox::-webkit-scrollbar {
          width: 5px;
        }
        .payfi-product-scrollbox::-webkit-scrollbar-track {
          background: #070c18;
          border-radius: 4px;
        }
        .payfi-product-scrollbox::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 4px;
        }
        .payfi-product-scrollbox::-webkit-scrollbar-thumb:hover {
          background: #38bdf8;
        }
      `}</style>

      {/* 🚀 NAVBAR KOMPAK & PRESISI */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderBottom: "1px solid #1f2937",
        paddingTop: "2px",
        paddingBottom: "12px",
        marginBottom: "16px",
        gap: "6px",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px", lineHeight: 1 }}>⚡</span>
          <h1 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
            {storeConfig.storeName}
          </h1>
        </div>

        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: 1.2 }}>
          {storeConfig.storeSubtitle}
        </p>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginTop: "4px" }}>
          <button
            type="button"
            onClick={() => setShowVerifyModal(true)}
            style={{ background: "#1e293b", color: "#38bdf8", border: "1px solid #334155", padding: "5px 10px", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "11px" }}
          >
            {t.verifyBtn}
          </button>

          <button
            type="button"
            onClick={() => setShowVendorModal(true)}
            style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", padding: "5px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: 800, fontSize: "11px" }}
          >
            {vendorProfile ? `🏪 ${vendorProfile.store_name}` : t.vendorBtn}
          </button>

          <button
            type="button"
            onClick={() => setShowPinModal(true)}
            style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #374151", padding: "5px 10px", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "11px" }}
          >
            ⚙️ Admin
          </button>
        </div>
      </div>

      {/* MONITOR BROADCAST SISTEM */}
      {(isTxPending || isConfirming || txHash || txError || connectError || fiatPaymentStatus === "PROCESSING") && (
        <div style={{ background: "#111827", padding: "14px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #1f2937" }}>
          <h4 style={{ marginTop: 0, marginBottom: "6px", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", color: "#94a3b8" }}>{t.monitorHeading}</h4>
          {fiatPaymentStatus === "PROCESSING" && <p style={{ color: "#38bdf8", margin: 0, fontSize: "13px", fontWeight: 500 }}>{t.monitorProcessing}</p>}
          {isTxPending && <p style={{ color: "#fbbf24", margin: 0, fontSize: "13px", fontWeight: 500 }}>{t.monitorSigning}</p>}
          {isConfirming && <p style={{ color: "#60a5fa", margin: 0, fontSize: "13px", fontWeight: 500 }}>⏳ Transaction transmitted to Solana Devnet. Awaiting block confirmation...</p>}
          {txHash && <p style={{ color: "#34d399", margin: 0, fontSize: "13px", fontWeight: 600, wordBreak: "break-all" }}>{t.monitorSuccess} <code>{txHash}</code></p>}
          {txError && <p style={{ color: "#f87171", margin: 0, fontSize: "13px", fontWeight: 500 }}>❌ Solana Transaction Error: {txError.message ? txError.message.split("\n")[0] : String(txError)}</p>}
        </div>
      )}

      {/* 🔍 SEARCH & CATEGORY BAR */}
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "16px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", background: "#0b0f19", border: "1px solid #374151", borderRadius: "10px", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px" }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {availableBadges.map((badge) => {
            const isTabActive = selectedBadge === badge;
            return (
              <button
                key={badge}
                type="button"
                onClick={() => handleCategoryChange(badge)}
                style={{ background: isTabActive ? "#2563eb" : "#1e293b", color: isTabActive ? "#ffffff" : "#94a3b8", border: isTabActive ? "1px solid #60a5fa" : "1px solid #334155", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s ease" }}
              >
                {badge === "ALL" ? t.allCategory : badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📦 GRID KATALOG PRODUK */}
      <div style={{ marginBottom: "25px" }}>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: 800, color: "#fff" }}>
              🛍️ {t.catalogHeading}
            </h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              {t.catalogSub}
            </p>
          </div>
          <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 700 }}>
            {isLoadingProducts ? "Loading..." : `${filteredProducts.length} Active Items`}
          </span>
        </div>

        {paginatedProducts.length === 0 ? (
          <div style={{ background: "#111827", border: "1px dashed #1f2937", borderRadius: "16px", padding: "40px 20px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
            {t.noProductsFound}
          </div>
        ) : (
          <div 
            className="payfi-product-scrollbox"
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "10px",
              maxHeight: isMobile ? "380px" : "480px",
              overflowY: "auto",
              paddingRight: "4px",
              boxSizing: "border-box",
              width: "100%"
            }}
          >
            {paginatedProducts.map((prod) => {
              const idrVal = Math.round(Number(prod.priceEth) * (storeConfig.rateIdr || 54000000));
              const usdVal = (Number(prod.priceEth) * (storeConfig.rateUsd || 3500)).toFixed(2);

              return (
                <div 
                  key={prod.id} 
                  onClick={() => handleOpenProduct(prod)}
                  style={{ 
                    background: "#070c18", 
                    border: "1px solid #1a263d", 
                    borderRadius: "12px", 
                    padding: isMobile ? "12px 14px" : "14px 18px", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    gap: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxSizing: "border-box",
                    width: "100%"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#38bdf8";
                    e.currentTarget.style.background = "#091224";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1a263d";
                    e.currentTarget.style.background = "#070c18";
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: 800, border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                        {prod.sku || `SKU-0${prod.id}`}
                      </span>
                      {prod.badge && (
                        <span style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: 800, border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                          ✨ {prod.badge}
                        </span>
                      )}
                      {prod.vendor_wallet && (
                        <span style={{ fontSize: "10px", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                          🏬 {prod.vendor_wallet.slice(0, 6)}...{prod.vendor_wallet.slice(-4)}
                        </span>
                      )}
                    </div>

                    <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {prod.name}
                    </h3>
                    
                    <p style={{ 
                      margin: 0, 
                      fontSize: "12px", 
                      color: "#94a3b8", 
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {prod.desc}
                    </p>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#38bdf8" }}>
                        {prod.priceEth} SOL
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#34d399" }}>
                        Rp {idrVal.toLocaleString("id-ID")}
                      </div>
                      <div style={{ fontSize: "10px", color: "#fb923c" }}>
                        ≈ ${usdVal} USD
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProduct(prod);
                      }}
                      style={{ 
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)", 
                        color: "#ffffff", 
                        border: "1px solid #60a5fa", 
                        padding: "8px 16px", 
                        borderRadius: "8px", 
                        cursor: "pointer", 
                        fontWeight: 700, 
                        fontSize: "12px" 
                      }}
                    >
                      {t.buyNow}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "24px" }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              style={{ background: currentPage === 1 ? "#1e293b50" : "#1e293b", color: currentPage === 1 ? "#64748b" : "#ffffff", border: "1px solid #334155", padding: "8px 14px", borderRadius: "8px", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: 700 }}
            >
              {t.prevPage}
            </button>

            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
              {t.pageIndicator(currentPage, totalPages)}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              style={{ background: currentPage === totalPages ? "#1e293b50" : "#1e293b", color: currentPage === totalPages ? "#64748b" : "#ffffff", border: "1px solid #334155", padding: "8px 14px", borderRadius: "8px", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: 700 }}
            >
              {t.nextPage}
            </button>
          </div>
        )}
      </div>

      {/* 📱 DOCK MOBILE */}
      {isMobile && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "64px",
          backgroundColor: "rgba(11, 15, 25, 0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #1f2937",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 99990,
          padding: "0 10px",
          boxSizing: "border-box"
        }}>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setSelectedBadge("ALL");
            }}
            style={{ background: "none", border: "none", color: "#cbd5e1", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", cursor: "pointer", fontSize: "10px", fontWeight: 600 }}
          >
            <span style={{ fontSize: "18px" }}>🛍️</span>
            <span>Storefront</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVerifyModal(true)}
            style={{ background: "none", border: "none", color: "#cbd5e1", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", cursor: "pointer", fontSize: "10px", fontWeight: 600 }}
          >
            <span style={{ fontSize: "18px" }}>🔍</span>
            <span>Verify</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVendorModal(true)}
            style={{ background: "none", border: "none", color: vendorProfile ? "#34d399" : "#60a5fa", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", cursor: "pointer", fontSize: "10px", fontWeight: 700 }}
          >
            <span style={{ fontSize: "18px" }}>🏪</span>
            <span>{vendorProfile ? "My Store" : "Vendor"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPinModal(true)}
            style={{ background: "none", border: "none", color: "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", cursor: "pointer", fontSize: "10px", fontWeight: 600 }}
          >
            <span style={{ fontSize: "18px" }}>⚙️</span>
            <span>Admin</span>
          </button>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ 
        borderTop: "1px solid #1f2937", 
        paddingTop: "14px", 
        marginTop: "20px", 
        marginBottom: isMobile ? "72px" : "10px", 
        textAlign: "center", 
        fontSize: "11px", 
        color: "#64748b" 
      }}>
        <p style={{ margin: 0 }}>© 2026 <strong>{storeConfig.storeName}</strong>. {t.footerText}</p>
      </div>

    </div>
  );
}

export default function App() {
  return <MainApp />;
}