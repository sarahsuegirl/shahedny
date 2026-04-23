import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';

export default function Availability() {
  const { t } = useTranslation();
  const [days, setDays] = useState(['Monday']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [status, setStatus] = useState('');

  const availableDaysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchAvailability = () => {
    fetch(`${API_URL}/api/availability`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.availability) {
          setDays(data.availability.days || []);
          if (data.availability.times) {
            setStartTime(data.availability.times.start || '09:00');
            setEndTime(data.availability.times.end || '17:00');
          }
        }
      });
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const toggleDay = (day) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus(t('saving_schedule'));

    try {
      const response = await fetch(`${API_URL}/api/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, times: { start: startTime, end: endTime } })
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus(t('success_schedule'));
      } else {
        setStatus(t('upload_failed') + data.error);
      }
    } catch (error) {
      setStatus(t('network_error'));
    }
  };

  return (
    <div className="glass-panel" style={{ textAlign: 'start', maxWidth: '800px', width: '100%', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--accent-light-purple)' }}>{t('manage_working_hours')}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('availability_subtitle')}</p>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div>
          <label style={{ display: 'block', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 'bold' }}>{t('available_days')}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
            {availableDaysList.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${days.includes(d) ? 'var(--accent-light-purple)' : 'rgba(255,255,255,0.2)'}`,
                  background: days.includes(d) ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: days.includes(d) ? 'var(--text-main)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {t(d)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{t('start_time')}</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{t('end_time')}</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem' }} />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start', padding: '12px 30px' }}>{t('save_schedule')}</button>
        {status && <p style={{ color: 'var(--accent-light-blue)', marginTop: '0.5rem', fontWeight: 'bold' }}>{status}</p>}
      </form>
    </div>
  );
}



