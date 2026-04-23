import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';

export default function Earnings() {
  const { t } = useTranslation();
  const [ledger, setLedger] = useState({ transactions: [], totalNetAvailable: 0, totalFees: 0, totalGross: 0 });

  useEffect(() => {
    fetch(`${API_URL}/api/payments/ledger`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLedger(data);
        }
      });
  }, []);

  const handlePayout = () => {
    alert(`Payout Request of $${ledger.totalNetAvailable.toFixed(2)} sent securely to admin pipeline!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', animation: 'fadeIn 0.3s ease-in' }}>
      <div className="glass-panel" style={{ textAlign: 'start', maxWidth: '1000px', width: '100%', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--accent-light-blue)' }}>Earnings & Payouts</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Gross Sales Volume</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>${ledger.totalGross.toFixed(2)}</p>
          </div>
          <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--accent-light-purple)' }}>
            <p style={{ color: 'var(--accent-light-purple)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Platform Fees (5%)</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>-${ledger.totalFees.toFixed(2)}</p>
          </div>
          <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--accent-light-blue)' }}>
            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Available Net Payout</p>
            <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>${ledger.totalNetAvailable.toFixed(2)}</p>
          </div>
        </div>

        <button onClick={handlePayout} className="btn-primary" style={{ width: 'auto', padding: '12px 30px' }} disabled={ledger.totalNetAvailable <= 0}>
          Request Bank/Wallet Payout
        </button>
      </div>

      <div className="glass-panel" style={{ textAlign: 'start', maxWidth: '1000px', width: '100%', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Transaction Ledger History</h2>
        
        {ledger.transactions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No sales recorded yet. Waiting for your first customer!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'start' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 'normal' }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 'normal' }}>Item ID</th>
                <th style={{ padding: '1rem', fontWeight: 'normal' }}>Gateway</th>
                <th style={{ padding: '1rem', fontWeight: 'normal' }}>Gross</th>
                <th style={{ padding: '1rem', fontWeight: 'normal' }}>Fee</th>
                <th style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-light-blue)' }}>Net Earned</th>
              </tr>
            </thead>
            <tbody>
              {ledger.transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{tx.productId.substring(0, 6)}</td>
                  <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>{tx.gateway}</span></td>
                  <td style={{ padding: '1rem' }}>${tx.grossAmount.toFixed(2)}</td>
                  <td style={{ padding: '1rem', color: 'var(--accent-light-purple)' }}>-${tx.platformFee.toFixed(2)}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>${tx.netEarnings.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}



