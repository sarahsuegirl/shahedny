import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <nav className="navbar" dir={i18n.language.startsWith('ar') ? 'rtl' : 'ltr'}>
      <Link to="/" className="nav-brand">
        {t('brand')}
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">{t('home')}</Link>
        <Link to="/features" className="nav-link">{t('features')}</Link>
        <Link to="/how-it-works" className="nav-link">{t('how_it_works')}</Link>
        <Link to="/pricing" className="nav-link">{t('pricing')}</Link>
        <Link to="/admin" className="nav-link" style={{ color: 'var(--accent-light-purple)', fontWeight: 'bold' }}>Admin</Link>
        
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 10px' }} />
        
        <button onClick={toggleLanguage} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', fontFamily: 'inherit' }}>
          {i18n.language.startsWith('ar') ? 'English' : 'عربي'}
        </button>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/dashboard" style={{ color: 'var(--accent-light-blue)', textDecoration: 'none', fontWeight: '600' }}>{user.name}</Link>
            <button onClick={handleLogout} className="btn-primary btn-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">{t('login')}</Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button className="btn-primary btn-sm">{t('signup')}</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
