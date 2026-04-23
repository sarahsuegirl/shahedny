import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    { icon: '📦', titleKey: 'feat_digital_title', descKey: 'feat_digital_desc' },
    { icon: '🎓', titleKey: 'feat_courses_title', descKey: 'feat_courses_desc' },
    { icon: '📅', titleKey: 'feat_calendar_title', descKey: 'feat_calendar_desc' },
    { icon: '💳', titleKey: 'feat_payments_title', descKey: 'feat_payments_desc' },
    { icon: '🌍', titleKey: 'feat_arabic_title', descKey: 'feat_arabic_desc' },
    { icon: '📊', titleKey: 'feat_analytics_title', descKey: 'feat_analytics_desc' },
  ];

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="title" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>{t('features')}</h1>
        <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>{t('features_subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {features.map((f, i) => (
          <div key={i} className="glass-panel" style={{ padding: '2rem', textAlign: 'start' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>{t(f.titleKey)}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{t(f.descKey)}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>{t('signup')}</button>
        </Link>
      </div>
    </div>
  );
}
