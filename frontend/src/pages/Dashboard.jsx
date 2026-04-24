import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';
import { Link, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Products from './Products';
import Availability from './Availability';
import Earnings from './Earnings';
import Settings from './Settings';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [overview, setOverview] = useState({ totalNet: 0, totalSales: 0 });
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Show instant preview
    setProfilePic(URL.createObjectURL(file));
    // Upload to backend
    const form = new FormData();
    form.append('profilePic', file);
    try {
      await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('shahedny_token')}` },
        body: form
      });
    } catch (err) {
      console.error('Failed to upload profile pic:', err);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/payments/ledger`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOverview({ totalNet: data.totalNetAvailable, totalSales: data.transactions.length });
        }
      });
  }, []);

  return (
    <div className="storefront-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'start' }}>{t('seller_dashboard')}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem' }}>
        
        {/* Sidebar */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content', textAlign: 'start' }}>
          {/* Clickable Avatar */}
          <div
            onClick={() => fileInputRef.current.click()}
            title="Click to upload profile photo"
            style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-light-blue), var(--accent-light-purple))', marginBottom: '1.5rem', cursor: 'pointer', overflow: 'hidden', position: 'relative', flexShrink: 0 }}
          >
            {profilePic ? (
              <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.3 }}>Click to<br/>upload</div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{user?.name || 'Seller User'}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{user?.email || 'user@example.com'}</p>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/dashboard" style={{ color: 'var(--accent-light-blue)', textDecoration: 'none', fontWeight: '600' }}>{t('overview')}</Link>
            <Link to="/dashboard/products" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>{t('products')}</Link>
            <Link to="/dashboard/availability" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>{t('calendar')}</Link>
            <Link to="/dashboard/earnings" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Earnings (Wallet)</Link>
            <Link to="/dashboard/settings" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>{t('settings')}</Link>
            
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
            <Link to={`/s/${user?.name?.toLowerCase().replace(/\s+/g, '') || 'demo'}`} target="_blank" style={{ color: 'white', background: 'var(--accent-light-purple)', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', textDecoration: 'none' }}>
              👀 View Display Storefront
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Routes>
            <Route path="/" element={
              <>
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'start', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('quick_stats')}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Net Lifetime {t('total_sales')}</p>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>${overview.totalNet.toFixed(2)}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Recent Order Count</p>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{overview.totalSales}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'start' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('recent_orders')}</h2>
                    <button className="btn-primary btn-sm" style={{ margin: 0 }}>{t('view_all')}</button>
                  </div>
                  <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-muted)' }}>{t('no_recent_orders')}</p>
                  </div>
                </div>
              </>
            } />
            <Route path="products" element={<Products />} />
            <Route path="availability" element={<Availability />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}



