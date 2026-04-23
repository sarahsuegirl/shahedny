import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './index.css';
import './i18n';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import Storefront from './pages/Storefront';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import ProductProfile from './pages/ProductProfile';

function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.documentElement.dir = i18n.language.startsWith('ar') ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="app-container">
      <div className="glass-panel">
        <h1 className="title">{t('hero_title')}</h1>
        <p className="subtitle">
          {t('hero_subtitle')}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          
          {user ? (
            <button className="btn-primary" style={{ gap: '12px' }} onClick={() => navigate('/dashboard')}>
              <span>Dashboard</span>
              <span style={{ transform: i18n.language.startsWith('ar') ? 'scaleX(-1)' : 'none', display: 'inline-block' }}>→</span>
            </button>
          ) : (
            <button className="btn-primary" style={{ gap: '12px' }} onClick={() => navigate('/signup')}>
              <span>{t('hero_cta')}</span>
              <span style={{ transform: i18n.language.startsWith('ar') ? 'scaleX(-1)' : 'none', display: 'inline-block' }}>→</span>
            </button>
          )}
          
          <button 
            onClick={() => {
               const slug = user ? user.name.toLowerCase().replace(/\s+/g, '') : 'sarah';
               navigate(`/s/${slug}`);
            }}
            style={{ 
              background: 'rgba(192, 132, 252, 0.15)', 
              border: '1px dashed var(--accent-light-purple)', 
              color: 'var(--text-main)', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              fontSize: '1rem'
            }}
          >
            <span>👀 View Display Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/s/:slug" element={<Storefront />} />
          <Route path="/book/:productId" element={<Booking />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/:productId" element={<Checkout />} />
          <Route path="/products/:productId" element={<ProductProfile />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

// cache invalidation trigger
