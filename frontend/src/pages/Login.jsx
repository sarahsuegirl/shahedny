import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user) return null; // Prevent flicker while redirecting

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
      } else {
        login(data.token, data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '3rem', textAlign: 'start' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('login')}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('login_subtitle')}</p>

        {error && (
          <div style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>{t('email_address')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>{t('password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem', display: 'none' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Password is intentionally bypassed for testing.</p>
          </div>
          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Signing in...' : t('login')}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          {t('no_account')}{' '}
          <Link to="/signup" style={{ color: 'var(--accent-light-blue)', textDecoration: 'none', fontWeight: 'bold' }}>{t('signup')}</Link>
        </p>
      </div>
    </div>
  );
}



