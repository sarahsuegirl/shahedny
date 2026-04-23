import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const { t } = useTranslation();

  const plans = [
    {
      nameKey: 'plan_free_name',
      price: '$0',
      periodKey: 'plan_period',
      feeKey: 'plan_free_fee',
      features: ['plan_free_f1', 'plan_free_f2', 'plan_free_f3'],
      cta: 'signup',
      highlight: false,
    },
    {
      nameKey: 'plan_pro_name',
      price: '$19',
      periodKey: 'plan_period',
      feeKey: 'plan_pro_fee',
      features: ['plan_pro_f1', 'plan_pro_f2', 'plan_pro_f3', 'plan_pro_f4'],
      cta: 'signup',
      highlight: true,
    },
    {
      nameKey: 'plan_business_name',
      price: '$49',
      periodKey: 'plan_period',
      feeKey: 'plan_business_fee',
      features: ['plan_business_f1', 'plan_business_f2', 'plan_business_f3', 'plan_business_f4'],
      cta: 'signup',
      highlight: false,
    },
  ];

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="title" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>{t('pricing')}</h1>
        <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>{t('pricing_subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {plans.map((plan, i) => (
          <div key={i} className="glass-panel" style={{ padding: '2.5rem', textAlign: 'start', position: 'relative', border: plan.highlight ? '1px solid var(--accent-light-purple)' : undefined, transform: plan.highlight ? 'scale(1.03)' : 'none' }}>
            {plan.highlight && (
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--accent-light-blue), var(--accent-light-purple))', padding: '4px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                {t('plan_popular')}
              </div>
            )}
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t(plan.nameKey)}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-light-purple)', marginBottom: '1.5rem' }}>{t(plan.feeKey)}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{plan.price}</span>
              <span style={{ color: 'var(--text-muted)' }}>/{t(plan.periodKey)}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {plan.features.map((f, j) => (
                <li key={j} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent-light-blue)' }}>✓</span> {t(f)}
                </li>
              ))}
            </ul>
            <Link to="/signup" style={{ textDecoration: 'none', display: 'block' }}>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', margin: 0, background: plan.highlight ? undefined : 'rgba(255,255,255,0.08)' }}>{t(plan.cta)}</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
