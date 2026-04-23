import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { productId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingDate = queryParams.get('date');
  const bookingTime = queryParams.get('time');
  const bookingEmail = queryParams.get('email');

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [gateway, setGateway] = useState('STRIPE');
  const [status, setStatus] = useState('');
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.products.find(p => p.id === productId);
          setProduct(found);
        }
      });
  }, [productId]);

  const handlePayment = async () => {
    if (!product) return;
    setStatus('Initializing secure payment gateway...');
    const endpoint = gateway === 'STRIPE' ? 'create-stripe-session' : 'create-paymob-iframe';

    try {
      const response = await fetch(`${API_URL}/api/payments/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, price: product.price })
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus(`Redirecting strictly to ${gateway} vault...`);
        
        // If it's a calendar booking, secure the booking securely post-transaction 
        if (bookingDate && bookingTime && bookingEmail) {
          await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: bookingDate, time: bookingTime, buyerEmail: bookingEmail, productId })
          });
        }
        
        setTimeout(() => {
          // Simulate the redirect returning correctly back to the application URL
          window.location.href = data.paymentUrl;
        }, 1500);
      }
    } catch (err) {
      setStatus('Secure Payment Network Check Failed.');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', margin: '4rem auto', width: '100%', textAlign: 'start' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-light-blue)' }}>Secure Checkout</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
        You are purchasing: <strong style={{ color: 'var(--text-main)' }}>{product ? product.title : 'Loading item...'}</strong>
        {bookingDate && <><br/>Scheduled for: <strong style={{ color: 'var(--text-main)'}}>{bookingDate} at {bookingTime}</strong></>}
      </p>

      <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', animation: 'fadeIn 0.3s ease-in' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Select Payment Method</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: `1px solid ${gateway === 'STRIPE' ? 'var(--accent-light-purple)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', cursor: 'pointer', background: gateway === 'STRIPE' ? 'rgba(192, 132, 252, 0.1)' : 'transparent', transition: 'all 0.2s' }}>
            <input type="radio" name="gateway" value="STRIPE" checked={gateway === 'STRIPE'} onChange={() => setGateway('STRIPE')} style={{ accentColor: 'var(--accent-light-purple)' }} />
            <div>
              <p style={{ fontWeight: 'bold' }}>Credit Card / Apple Pay (Stripe)</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Global secure payments via Stripe.</p>
            </div>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: `1px solid ${gateway === 'PAYMOB' ? 'var(--accent-light-blue)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', cursor: 'pointer', background: gateway === 'PAYMOB' ? 'rgba(56, 189, 248, 0.1)' : 'transparent', transition: 'all 0.2s' }}>
            <input type="radio" name="gateway" value="PAYMOB" checked={gateway === 'PAYMOB'} onChange={() => setGateway('PAYMOB')} style={{ accentColor: 'var(--accent-light-blue)' }} />
            <div>
              <p style={{ fontWeight: 'bold' }}>Vodafone Cash / Meeza (Paymob)</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Local alternative payment options via Paymob in Egypt.</p>
            </div>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Total Amount:</p>
        <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
          ${product ? product.price.toFixed(2) : '0.00'}
        </p>
      </div>

      <button onClick={handlePayment} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }} disabled={!product}>
        Pay Securely
      </button>

      {status && (
        <div style={{ padding: '1rem', marginTop: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center', animation: 'fadeIn 0.3s ease-in' }}>
          <p style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{status}</p>
        </div>
      )}
    </div>
  );
}



