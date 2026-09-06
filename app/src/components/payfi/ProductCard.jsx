export function ProductCard({
  product,
  currencySymbol = "SOL",
  onBuy,
  onOpenWalletModal,
  isTxPending,
  isConnected
}) {
  if (!product) return null;

  const finalPrice = product.priceEth || product.defaultPriceEth || "0.005";
  const productSku = product.sku || `SKU-0${product.id}`;

  const handleClick = () => {
    if (!isConnected && onOpenWalletModal) {
      onOpenWalletModal();
    } else if (onBuy) {
      onBuy(product.id, finalPrice);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #0b0f19 100%)",
        borderRadius: "14px",
        border: "1px solid #1e293b",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "16px",
        boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.4)",
        transition: "all 0.25s ease",
        height: "100%",
        boxSizing: "border-box"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#38bdf8";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1e293b";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top Header: SKU & Status */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              background: "rgba(56, 189, 248, 0.1)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              padding: "2px 8px",
              borderRadius: "12px",
              fontWeight: 800,
              letterSpacing: "0.05em"
            }}
          >
            {productSku}
          </span>
          <span style={{ display: "inline-flex", width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
        </div>

        {/* Product Title */}
        <h3
          style={{
            margin: "0 0 6px 0",
            fontSize: "14px",
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: "1.3",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
          title={product.name}
        >
          {product.name || "ZoniqFi Digital Asset"}
        </h3>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#94a3b8",
            lineHeight: "1.4",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "30px"
          }}
        >
          {product.desc || product.description || ""}
        </p>
      </div>

      {/* Bottom Area: Pricing & Action Button */}
      <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
            Harga On-Chain
          </span>
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#38bdf8" }}>
            {finalPrice} {currencySymbol}
          </span>
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={isTxPending}
          style={{
            width: "100%",
            background: isTxPending
              ? "#334155"
              : isConnected
                ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                : "#1e293b",
            color: "#ffffff",
            border: isConnected ? "1px solid #60a5fa" : "1px solid #334155",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: isTxPending ? "not-allowed" : "pointer",
            fontWeight: 700,
            fontSize: "12px",
            boxShadow: isConnected ? "0 2px 10px rgba(37, 99, 235, 0.25)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          {isTxPending
            ? "⏳ Memproses..."
            : isConnected
              ? "⚡ Checkout"
              : "🔌 Hubungkan Wallet"}
        </button>
      </div>
    </div>
  );
}