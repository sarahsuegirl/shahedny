import React from 'react';
import { Link } from 'react-router-dom';

export default function CheckoutSuccess() {
  return (
    <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', margin: '4rem auto', width: '100%', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg fill="none" stroke="white" viewBox="0 0 24 24" width="40" height="40"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Payment Successful!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Thank you for your purchase! Your order has been securely processed and confirmed directly on the platform.</p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ margin: '0 auto' }}>Return to Home</button>
      </Link>
    </div>
  );
}
