import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Booking() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [availability, setAvailability] = useState({ days: [], times: { start: '09:00', end: '17:00' } });
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [bookings, setBookings] = useState([]);
  
  const generateTimeSlots = (start, end) => {
    const slots = [];
    let current = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    while (current < endHour) {
      const time00 = `${current.toString().padStart(2, '0')}:00`;
      const time30 = `${current.toString().padStart(2, '0')}:30`;
      
      const isBooked00 = bookings.some(b => b.date === selectedDay && b.time === time00);
      const isBooked30 = bookings.some(b => b.date === selectedDay && b.time === time30);
      
      if (!isBooked00) slots.push(time00);
      if (!isBooked30) slots.push(time30);
      current++;
    }
    return slots;
  };

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.products.find(p => p.id === productId);
          setProduct(found);
        }
      });

    fetch(`${API_URL}/api/availability`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.availability) {
          setAvailability(data.availability);
        }
      });

    fetch(`${API_URL}/api/bookings`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.bookings) {
          setBookings(data.bookings);
        }
      });
  }, [productId]);

  const handleProceedToCheckout = (e) => {
    e.preventDefault();
    if (!selectedDay || !selectedTime) return setStatus(t('select_day_time_err'));
    if (!email) return setStatus('Please enter your email.');
    
    // Safely redirect to central Checkout Page holding the URL params
    navigate(`/checkout/${productId}?date=${encodeURIComponent(selectedDay)}&time=${encodeURIComponent(selectedTime)}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="glass-panel" style={{ padding: '3rem', maxWidth: '800px', margin: '2rem auto', width: '100%', textAlign: 'start' }}>
      <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--accent-light-blue)' }}>{t('book_a_session')}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
        {t('reserve_slot_with')} {product ? `for "${product.title}"` : "the seller"}.
      </p>

      <form onSubmit={handleProceedToCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('select_day')}</h3>
          {(!availability.days || availability.days.length === 0) ? (
            <p style={{ color: 'var(--accent-light-purple)', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>{t('no_schedule_slots')}</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {availability.days.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setSelectedDay(d); setSelectedTime(''); }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedDay === d ? 'var(--accent-light-blue)' : 'rgba(255,255,255,0.1)'}`,
                    background: selectedDay === d ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: selectedDay === d ? 'var(--text-main)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {t(d)}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedDay && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('select_time')}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {generateTimeSlots(availability.times.start, availability.times.end).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedTime === t ? 'var(--accent-light-purple)' : 'rgba(255,255,255,0.1)'}`,
                    background: selectedTime === t ? 'rgba(192, 132, 252, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: selectedTime === t ? 'var(--text-main)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {(selectedDay && selectedTime) && (
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', animation: 'fadeIn 0.3s ease-in' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('your_details')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)' }}>{t('email_address')}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem' }} />
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center', padding: '14px' }}>
              Proceed to Secure Checkout
            </button>
          </div>
        )}

        {status && (
          <div style={{ padding: '1.5rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', border: '1px dashed var(--accent-light-blue)' }}>
            <p style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{status}</p>
          </div>
        )}
      </form>
    </div>
  );
}



