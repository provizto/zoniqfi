import { useState } from "react";

export function CheckoutModal({
  product,
  onClose,
  onCryptoPay,
  onFiatPay,
  isTxPending,
  currencySymbol = "SOL"
}) {
  const [method, setMethod] = useState("fiat"); // Default ke Fiat untuk menonjolkan PayFi

  if (!product) return null;

  const badgeText = product.badge || `SKU-0${product.id}`;
  // Bersih dari variabel Ethereum
  const displaySolPrice = product.priceSol || product.price || "0.05";
  const displayIdrPrice = product.priceIdr 
    ? `Rp ${Number(product.priceIdr).toLocaleString('id-ID')}` 
    : "Rp 50.000";
  const displayDesc = product.desc || product.description || "";

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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)"
      }}
    >
      <div
        style={{
          background: "#0b121f",
          border: "1px solid #1e293b",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "440px",
          padding: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85)",
          position: "relative",
          color: "#f8fafc",
          boxSizing: "border-box",
          textAlign: "left",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
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
              background: "rgba(56, 189, 248, 0.12)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              padding: "2px 8px",
              borderRadius: "10px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}
          >
            {badgeText}
          </span>
          <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "8px 0 4px 0", color: "#ffffff" }}>
            {product.name}
          </h3>
          {displayDesc ? (
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>
              {displayDesc}
            </p>
          ) : null}
        </div>

        {/* Deliverables Checklist */}
        {product.deliverables && product.deliverables.length > 0 && (
          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid #1e293b",
              borderRadius: "12px",
              padding: "10px 14px",
              marginBottom: "16px"
            }}
          >
            <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
              License & Deliverables:
            </div>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6" }}>
              {product.deliverables.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab Jalur Bayar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            background: "#070a13",
            padding: "4px",
            borderRadius: "10px",
            marginBottom: "16px",
            border: "1px solid #1e293b"
          }}
        >
          <button
            type="button"
            onClick={() => setMethod("fiat")}
            style={{
              padding: "9px 6px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: method === "fiat" ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
              color: method === "fiat" ? "#ffffff" : "#94a3b8",
              transition: "all 0.2s ease"
            }}
          >
            💳 Direct QRIS (PayFi)
          </button>
          <button
            type="button"
            onClick={() => setMethod("crypto")}
            style={{
              padding: "9px 6px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: method === "crypto" ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "transparent",
              color: method === "crypto" ? "#ffffff" : "#94a3b8",
              transition: "all 0.2s ease"
            }}
          >
            ⚡ Solana Pay ({currencySymbol})
          </button>
        </div>

        {/* Jalur Fiat (PayFi Highlight) */}
        {method === "fiat" && (
          <div>
            <div style={{ textAlign: "center", margin: "10px 0 16px 0" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#34d399" }}>
                {displayIdrPrice}
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px" }}>
                100% Direct Payout to Vendor • 5% Protocol Fee from Gas Tank
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
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)"
              }}
            >
              💳 Pay via QRIS (Instant Settlement)
            </button>
          </div>
        )}

        {/* Jalur Web3 (Solana Devnet) */}
        {method === "crypto" && (
          <div>
            <div style={{ textAlign: "center", margin: "10px 0 16px 0" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#38bdf8" }}>
                {displaySolPrice} {currencySymbol}
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px" }}>
                Native Solana On-Chain Transfer (Devnet Verified)
              </div>
            </div>
            <button
              type="button"
              disabled={isTxPending}
              onClick={() => onCryptoPay(product.id, displaySolPrice)}
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
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)"
              }}
            >
              {isTxPending ? "⏳ Processing Transaction..." : "⚡ Pay with Solana Wallet"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}