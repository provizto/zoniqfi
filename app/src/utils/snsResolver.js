// Utilitas Resolusi SNS (.sns & .sol) untuk ZoniqFi
export const formatWalletDisplay = (address, snsDomain = null) => {
  if (snsDomain) return snsDomain;
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const isSNSDomain = (input) => {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim().toLowerCase();
  return trimmed.endsWith('.sol') || trimmed.endsWith('.sns');
};

export const resolveSNSInput = (input) => {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      resolvedAddress: "",
      displayName: "",
      isDomain: false
    };
  }

  let trimmed = input.trim();
  
  // Ekstrak parameter jika input berupa link lengkap
  if (trimmed.includes("?ref=")) {
    trimmed = trimmed.split("?ref=")[1].split("&")[0].trim();
  }
  
  if (!isSNSDomain(trimmed)) {
    return {
      isValid: trimmed.length >= 32,
      resolvedAddress: trimmed,
      displayName: trimmed.length > 10 ? `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}` : trimmed,
      isDomain: false
    };
  }

  // Ganti ekstensi hanya pada akhir string
  const lower = trimmed.toLowerCase();
  const normalizedDomain = lower.endsWith('.sol') 
    ? trimmed.slice(0, -4) + '.sns' 
    : trimmed;

  return {
    isValid: true,
    resolvedAddress: `SNS-${trimmed.replace(/[^a-zA-Z0-9]/g, '')}-VaultAddressDevnet`,
    displayName: normalizedDomain,
    isDomain: true
  };
};