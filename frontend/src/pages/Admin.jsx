import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const TABS = ['Overview', 'Users', 'Products', 'Bookings', 'Ledger'];

export default function Admin() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('Overview');

  const fetchData = () => {
    fetch(`${API_URL}/api/admin/overview`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('shahedny_token')}`
      }
    })
      .then(res => res.json())
      .then(d => { 
        if (d.success) setData(d); 
        else console.error('Admin fetch failed:', d.error);
      })
      .catch(err => console.error('Network error fetching admin data', err));
  };

  useEffect(() => { fetchData(); }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm('Remove this product from the platform?')) return;
    await fetch(`${API_URL}/api/admin/products/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('shahedny_token')}`
      }
    });
    fetchData();
  };

  if (!data) return <p style={{ color: 'var(--text-muted)', padding: '4rem', textAlign: 'center' }}>Loading admin data...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'start' }}>Admin Control Panel</h1>
      <p style={{ color: 'var(--accent-light-purple)', marginBottom: '2rem', textAlign: 'start' }}>Full platform management — visible only to you as admin.</p>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Users', value: data.stats.totalUsers },
          { label: 'Total Products', value: data.stats.totalProducts },
          { label: 'Total Bookings', value: data.stats.totalBookings },
          { label: 'Gross Revenue', value: `$${data.stats.totalRevenue.toFixed(2)}` },
          { label: 'Platform Fees Earned', value: `$${data.stats.platformFees.toFixed(2)}` },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'start' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{s.label}</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: '20px', border: `1px solid ${tab === t ? 'var(--accent-light-purple)' : 'rgba(255,255,255,0.15)'}`, background: tab === t ? 'rgba(192,132,252,0.15)' : 'transparent', color: tab === t ? 'var(--text-main)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: tab === t ? 'bold' : 'normal', transition: 'all 0.2s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'start' }}>

        {/* Overview */}
        {tab === 'Overview' && (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Platform Health</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '2' }}>
              You have <strong style={{ color: 'var(--text-main)' }}>{data.stats.totalUsers}</strong> registered users, 
              <strong style={{ color: 'var(--text-main)' }}> {data.stats.totalProducts}</strong> products across all sellers, 
              <strong style={{ color: 'var(--text-main)' }}> {data.stats.totalBookings}</strong> confirmed bookings, 
              and your platform has earned <strong style={{ color: 'var(--accent-light-blue)' }}>${data.stats.platformFees.toFixed(2)}</strong> in fees 
              from <strong style={{ color: 'var(--text-main)' }}>${data.stats.totalRevenue.toFixed(2)}</strong> gross revenue.
            </p>
          </div>
        )}

        {/* Users */}
        {tab === 'Users' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Platform Users ({data.users.length})</h2>
            {data.users.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No users registered yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Name</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Email</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Role</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Joined</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>{u.name}</td>
                      <td style={{ padding: '0.8rem' }}>{u.email}</td>
                      <td style={{ padding: '0.8rem' }}><span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>{u.role}</span></td>
                      <td style={{ padding: '0.8rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '0.8rem' }}>
                        <button onClick={() => {
                          if (window.confirm('Delete this user account?')) {
                            fetch(`${API_URL}/api/admin/users/${u.id}`, { 
                              method: 'DELETE',
                              headers: { 'Authorization': `Bearer ${localStorage.getItem('shahedny_token')}` }
                            }).then(() => fetchData());
                          }
                        }} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Products */}
        {tab === 'Products' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>All Platform Products ({data.products.length})</h2>
            {data.products.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No products uploaded yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Title</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Type</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Price</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Uploaded</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>{p.title}</td>
                      <td style={{ padding: '0.8rem' }}><span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>{p.type}</span></td>
                      <td style={{ padding: '0.8rem', color: 'var(--accent-light-purple)' }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: '0.8rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '0.8rem' }}>
                        <button onClick={() => deleteProduct(p.id)} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Bookings */}
        {tab === 'Bookings' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>All Bookings ({data.bookings.length})</h2>
            {data.bookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No bookings recorded yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Buyer Email</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Date</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Time</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Status</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>{b.buyerEmail}</td>
                      <td style={{ padding: '0.8rem' }}>{b.date}</td>
                      <td style={{ padding: '0.8rem' }}>{b.time}</td>
                      <td style={{ padding: '0.8rem' }}><span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.8rem' }}>{b.status}</span></td>
                      <td style={{ padding: '0.8rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Ledger */}
        {tab === 'Ledger' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Transaction Ledger ({data.ledger.length} transactions)</h2>
            {data.ledger.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No transactions recorded yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Date</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Gateway</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Gross</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start' }}>Platform Fee</th>
                    <th style={{ padding: '0.8rem', fontWeight: 'normal', textAlign: 'start', color: 'var(--accent-light-blue)' }}>Seller Net</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ledger.map(tx => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.8rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(tx.date).toLocaleString()}</td>
                      <td style={{ padding: '0.8rem' }}><span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>{tx.gateway}</span></td>
                      <td style={{ padding: '0.8rem' }}>${tx.grossAmount.toFixed(2)}</td>
                      <td style={{ padding: '0.8rem', color: 'var(--accent-light-purple)' }}>+${tx.platformFee.toFixed(2)}</td>
                      <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>${tx.netEarnings.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}



