import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { num: '01', titleKey: 'hiw_step1_title', descKey: 'hiw_step1_desc' },
    { num: '02', titleKey: 'hiw_step2_title', descKey: 'hiw_step2_desc' },
    { num: '03', titleKey: 'hiw_step3_title', descKey: 'hiw_step3_desc' },
    { num: '04', titleKey: 'hiw_step4_title', descKey: 'hiw_step4_desc' },
  ];

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="title" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>{t('how_it_works')}</h1>
        <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>{t('hiw_subtitle')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-light-blue), var(--accent-light-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {step.num}
            </div>
            <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', textAlign: 'start' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.6rem' }}>{t(step.titleKey)}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{t(step.descKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>{t('hero_cta')}</button>
        </Link>
      </div>
    </div>
  );
}
