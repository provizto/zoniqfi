import React, { useState } from 'react';

const ClientOnboardingForm = () => {
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Di sini Anda bisa mengintegrasikan API Telegram Bot atau Email untuk mengirim data ke tim Anda
    console.log("Data Onboarding Klien Terkirim:", formData);
    alert("Form submitted successfully! Our development team will review your parameters.");
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
          <input type="text" required style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff' }} onChange={e => setFormData({...formData, projectName: e.target.value})} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Token Symbol / Ticker (e.g., $ZQI)</label>
          <input type="text" required style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff' }} onChange={e => setFormData({...formData, tokenTicker: e.target.value})} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Primary Branding Colors (Hex Codes)</label>
          <input type="text" placeholder="e.g., Background #0b0f19, Accent #14b8a6" style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff' }} onChange={e => setFormData({...formData, brandColors: e.target.value})} />
        </div>

        {/* SECTION 2 */}
        <h4 style={{ color: '#38bdf8', margin: '25px 0 10px 0' }}>[ 2. SOLANA CONTRACT INTEGRATION ]</h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Token Mint Address</label>
          <input type="text" required style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff' }} onChange={e => setFormData({...formData, mintAddress: e.target.value})} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Official Telegram Link</label>
          <input type="url" required style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff' }} onChange={e => setFormData({...formData, telegramLink: e.target.value})} />
        </div>

        {/* SECTION 3 */}
        <h4 style={{ color: '#38bdf8', margin: '25px 0 10px 0' }}>[ 3. SERVER & DOMAIN ROUTING ]</h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Target Custom Domain (swap.yourtoken.com)</label>
          <input type="text" required style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff' }} onChange={e => setFormData({...formData, customDomain: e.target.value})} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Preferred Deployment Host Access</label>
          <select style={{ width: '100%', padding: '10px', background: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff' }} onChange={e => setFormData({...formData, hostingPreference: e.target.value})}>
            <option value="cloudflare">Client will provide Cloudflare DNS access</option>
            <option value="isolated">Request ZoniqFi team isolated hosting</option>
          </select>
        </div>

        <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginTop: '15px', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)' }}>
          Submit Onboarding Data
        </button>
      </form>
    </div>
  );
};

export default ClientOnboardingForm;