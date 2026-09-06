import { useState } from "react";
import type { Product } from "./products";

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onCryptoPay: (id: number, priceEth: string) => void;
  onFiatPay: (product: Product) => void;
  isTxPending: boolean;
  currencySymbol?: string;
}

export function CheckoutModal({
  product,
  onClose,
  onCryptoPay,
  onFiatPay,
  isTxPending,
  currencySymbol = "ETH"
}: CheckoutModalProps) {
  const [method, setMethod] = useState<"crypto" | "fiat">("crypto");

  const badgeText = product.badge || `SKU-0${product.id}`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)"
      }}
    >
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "440px",
          padding: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          position: "relative",
          color: "#f8fafc",
          boxSizing: "border-box"
        }}
      >
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            color: "#64748b",
            fontSize: "18px",
            cursor: "pointer",
            padding: "4px 8px"
          }}
        >
          ✕
        </button>

        {/* Header Modal */}
        <div style={{ marginBottom: "16px" }}>
          <span
            style={{
              fontSize: "10px",
              background: "rgba(56, 189, 248, 0.1)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              padding: "2px 8px",
              borderRadius: "10px",
              fontWeight: 800,
              textTransform: "uppercase"
            }}
          >
            {badgeText}
          </span>
          <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "8px 0 4px 0", color: "#ffffff" }}>
            {product.name}
          </h3>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>
            {product.description}
          </p>
        </div>

        {/* Deliverables Checklist */}
        {product.deliverables && product.deliverables.length > 0 && (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(51, 65, 85, 0.5)",
              borderRadius: "12px",
              padding: "10px 14px",
              marginBottom: "16px"
            }}
          >
            <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
              Benefit & Akses:
            </div>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6" }}>
              {product.deliverables.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab Pemilihan Jalur Pembayaran */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            background: "#0b0f19",
            padding: "4px",
            borderRadius: "10px",
            marginBottom: "16px"
          }}
        >
          <button
            type="button"
            onClick={() => setMethod("crypto")}
            style={{
              padding: "8px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: method === "crypto" ? "#2563eb" : "transparent",
              color: method === "crypto" ? "#ffffff" : "#94a3b8",
              transition: "all 0.2s ease"
            }}
          >
            ⚡ Web3 ({currencySymbol})
          </button>
          <button
            type="button"
            onClick={() => setMethod("fiat")}
            style={{
              padding: "8px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: method === "fiat" ? "#10b981" : "transparent",
              color: method === "fiat" ? "#ffffff" : "#94a3b8",
              transition: "all 0.2s ease"
            }}
          >
            💳 QRIS / e-Wallet
          </button>
        </div>

        {/* Konten Jalur Web3 */}
        {method === "crypto" && (
          <div>
            <div style={{ textAlign: "center", margin: "12px 0 16px 0" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#38bdf8" }}>
                {product.defaultPriceEth} {currencySymbol}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                Direct Smart Contract Settlement on Sepolia
              </div>
            </div>
            <button
              type="button"
              disabled={isTxPending}
              onClick={() => onCryptoPay(product.id, product.defaultPriceEth)}
              style={{
                width: "100%",
                padding: "12px",
                background: isTxPending ? "#334155" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                border: "1px solid #60a5fa",
                borderRadius: "10px",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "13px",
                cursor: isTxPending ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)"
              }}
            >
              {isTxPending ? "⏳ Memproses di MetaMask..." : "⚡ Konfirmasi Pembelian Web3"}
            </button>
          </div>
        )}

        {/* Konten Jalur Fiat */}
        {method === "fiat" && (
          <div>
            <div style={{ textAlign: "center", margin: "12px 0 16px 0" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#34d399" }}>
                Pembayaran Otomatis IDR
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                QRIS, GoPay, BCA, Mandiri (Gasless Relay Mint)
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFiatPay(product)}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #059669, #10b981)",
                border: "1px solid #34d399",
                borderRadius: "10px",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)"
              }}
            >
              💳 Buka Popup QRIS / Bank Transfer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}