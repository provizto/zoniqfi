import React, { useState } from 'react';

const ClientOnboardingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    tokenTicker: '',
    brandColors: '',
    mintAddress: '',
    telegramLink: '',
    twitterLink: '', 
    customDomain: '',
    hostingPreference: 'cloudflare',
    enablePayFi: 'yes',
    primaryCategory: 'Digital Assets & Software',
    clientSignature: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const EMAIL_TUJUAN = "zoniqfi@gmail.com"; 

    const payload = {
      _subject: `ZoniqFi Onboarding & PayFi Request: ${formData.projectName || 'New Client'}`,
      _captcha: "false",
      "Project Name": formData.projectName,
      "Token Ticker": formData.tokenTicker,
      "Branding Colors / Hex": formData.brandColors,
      "Solana Mint Address": formData.mintAddress,
      "Official Telegram Link": formData.telegramLink,
      "Official X (Twitter) Link": formData.twitterLink || "Not Provided",
      "Target Custom Domain": formData.customDomain,
      "Hosting Preference": formData.hostingPreference === 'cloudflare' ? 'Cloudflare DNS Access' : 'Isolated Hosting Request',
      "Enable PayFi / QRIS Gateway": formData.enablePayFi === 'yes' ? 'Yes (Integrated Commerce)' : 'No (DeFi Only)',
      "Primary Merchant Category": formData.primaryCategory,
      "Client Signature / Handle": formData.clientSignature
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL_TUJUAN}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("🎉 Onboarding & PayFi data successfully submitted! Our team will review your parameters and contact you shortly.");
        
        setFormData({
          projectName: '',
          tokenTicker: '',
          brandColors: '',
          mintAddress: '',
          telegramLink: '',
          twitterLink: '',
          customDomain: '',
          hostingPreference: 'cloudflare',
          enablePayFi: 'yes',
          primaryCategory: 'Digital Assets & Software',
          clientSignature: ''
        });
      } else {
        throw new Error("Formsubmit routing validation rejected.");
      }
    } catch (error) {
      console.error("Submission Error Details:", error);
      alert("⚠️ Connection sync failed. Please reach out directly to @zoniqfi on Telegram.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '30px', background: '#0b121f', border: '1px solid #1e293b', borderRadius: '12px', color: '#f3f4f6', fontFamily: 'sans-serif', textAlign: 'left' }}>
      <h2 style={{ color: '#ffffff', borderBottom: '1px solid #1e293b', paddingBottom: '10px', margin: '0 0 20px 0' }}>⚡ ZoniqFi — White-Label & PayFi Onboarding</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '25px' }}>Fill out this form to initiate your custom Solana protocol deployment and merchant gateway setup.</p>
      
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
        <h4 style={{ color: '#38bdf8', margin: '25px 0 10px 0' }}>[ 2. SOLANA CONTRACT & PAYFI SETUP ]</h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Token Mint Address</label>
          <input type="text" required value={formData.mintAddress} style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none' }} onChange={e => setFormData({...formData, mintAddress: e.target.value})} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Enable PayFi / QRIS Gateway?</label>
            <select value={formData.enablePayFi} style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }} onChange={e => setFormData({...formData, enablePayFi: e.target.value})}>
              <option value="yes">Yes (Full Merchant Commerce)</option>
              <option value="no">No (DeFi Swap & Vault Only)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Primary Industry / Vertical</label>
            <select value={formData.primaryCategory} style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', outline: 'none', cursor: 'pointer' }} onChange={e => setFormData({...formData, primaryCategory: e.target.value})}>
              <option value="Digital Assets & Software">Digital Assets & Software</option>
              <option value="NFT & Web3 Collectibles">NFT & Web3 Collectibles</option>
              <option value="E-Books & Education">E-Books & Education</option>
              <option value="Fashion & Merchandise">Fashion & Merchandise</option>
              <option value="Physical Goods / RWA">Physical Goods / RWA (UMKM)</option>
            </select>
          </div>
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

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            width: '100%', 
            padding: '14px', 
            background: isSubmitting ? '#4b5563' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)', 
            border: 'none', 
            borderRadius: '8px', 
            color: '#fff', 
            fontWeight: '700', 
            fontSize: '1rem', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(139, 92, 246, 0.4)', 
            transition: 'all 0.2s',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? 'Transmitting Data...' : 'Submit Onboarding Data'}
        </button>
      </form>
    </div>
  );
};

export default ClientOnboardingForm;