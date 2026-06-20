import React, { useState } from 'react';

const ClientOnboardingForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    tokenTicker: '',
    brandColors: '',
    mintAddress: '',
    telegramLink: '',
    twitterLink: '', // Dipertahankan untuk integrasi telegram
    customDomain: '',
    hostingPreference: 'cloudflare',
    clientSignature: '' // Dipertahankan untuk verifikasi handle/wallet
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================================================
    // KREDENSIAL TELEGRAM BOT (Ganti dengan Token & Chat ID Anda)
    // ==========================================================================
    const TELEGRAM_TOKEN = "8719708902:AAGRsfqqfrPlWi2KbifPiZRIH30bSD5yhL8";
    const CHAT_ID = "8559621472";

    // Menyusun teks notifikasi terstruktur dengan format Markdown
    const telegramMessage = `
🚨 *NEW WHITE-LABEL ORDER RECEIVED* 🚨
======================================
• *Project Name:* ${formData.projectName}
• *Token Ticker:* ${formData.tokenTicker}
• *Mint Address:* \`${formData.mintAddress}\`
• *Target Domain:* ${formData.customDomain}
• *Hosting Pref:* ${formData.hostingPreference === 'cloudflare' ? 'Cloudflare DNS Access' : 'Isolated Hosting Request'}

🌐 *Media Links:*
• Telegram: ${formData.telegramLink}
• Twitter/X: ${formData.twitterLink || 'Not Provided'}

🎨 *Branding Hex / Codes:*
${formData.brandColors}
======================================
👉 *Verified Handle/Wallet:* \`${formData.clientSignature || 'Manual Chat Check'}\`
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        alert("🎉 Onboarding data successfully submitted! Our team will review your parameters and ping you shortly.");
        // Reset form setelah pengiriman berhasil
        setFormData({
          projectName: '',
          tokenTicker: '',
          brandColors: '',
          mintAddress: '',
          telegramLink: '',
          twitterLink: '',
          customDomain: '',
          hostingPreference: 'cloudflare',
          clientSignature: ''
        });
        e.target.reset();
      } else {
        throw new Error("Telegram API rejected the broadcast payload.");
      }
    } catch (error) {
      console.error("Telegram Transmission Error:", error);
      alert("⚠️ Network synchronization failed. Please reach out directly to @zoniqfi on Telegram.");
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '30px', background: '#0b121f', border: '1px solid #1e293b', borderRadius: '12px', color: '#f3f4f6', fontFamily: 'sans-serif', textAlign: 'left' }}>
      <h2 style={{ color: '#ffffff', borderBottom: '1px solid #1e293b', paddingBottom: '10px', margin: '0 0 20px 0' }}>⚡ ZoniqFi — Client Onboarding</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '25px' }}>Please fill out this form accurately to initiate the white-label custom deployment process.</p>
      
      <form onSubmit={handleSubmit}>
        {/* SECTION 1 */}
        <h4 style={{ color: '#38bdf8', margin: '20px 0 10px 0' }}>[ 1. BRAND IDENTITY ]</h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Official Project / Token Name</label>
          <input type="text" required value={formData.projectName} style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none' }} onChange={e => setFormData({...formData, projectName: e.target.value})} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Token Symbol / Ticker (e.g., $ZQI)</label>
          <input type="text" required value={formData.tokenTicker} style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none' }} onChange={e => setFormData({...formData, tokenTicker: e.target.value})} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Primary Branding Colors & Hex Codes</label>
          <input type="text" required value={formData.brandColors} placeholder="e.g., Background #0b0f19, Accent #14b8a6" style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none' }} onChange={e => setFormData({...formData, brandColors: e.target.value})} />
        </div>

        {/* SECTION 2 */}
        <h4 style={{ color: '#38bdf8', margin: '25px 0 10px 0' }}>[ 2. SOLANA CONTRACT INTEGRATION ]</h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Token Mint Address</label>
          <input type="text" required value={formData.mintAddress} style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none' }} onChange={e => setFormData({...formData, mintAddress: e.target.value})} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Official Telegram Group Link</label>
          <input type="url" required value={formData.telegramLink} style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none' }} onChange={e => setFormData({...formData, telegramLink: e.target.value})} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Official X (Twitter) Link</label>
          <input type="url" value={formData.twitterLink} placeholder="https://x.com/yourproject" style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none' }} onChange={e => setFormData({...formData, twitterLink: e.target.value})} />
        </div>

        {/* SECTION 3 */}
        <h4 style={{ color: '#38bdf8', margin: '25px 0 10px 0' }}>[ 3. SERVER & DOMAIN ROUTING ]</h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Target Custom Domain (swap.yourtoken.com)</label>
          <input type="text" required value={formData.customDomain} style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none' }} onChange={e => setFormData({...formData, customDomain: e.target.value})} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Preferred Deployment Host Access</label>
          <select value={formData.hostingPreference} style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }} onChange={e => setFormData({...formData, hostingPreference: e.target.value})}>
            <option value="cloudflare">Client will provide Cloudflare DNS access</option>
            <option value="isolated">Request ZoniqFi team isolated hosting</option>
          </select>
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Your Telegram Handle / Wallet Address (For Verification)</label>
          <input type="text" required value={formData.clientSignature} placeholder="@username or Solana Public Key" style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none' }} onChange={e => setFormData({...formData, clientSignature: e.target.value})} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)', transition: 'all 0.2s' }}>
          Submit Onboarding Data
        </button>
      </form>
    </div>
  );
};

export default ClientOnboardingForm;