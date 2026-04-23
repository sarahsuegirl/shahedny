import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { t } = useTranslation();
  const { user, getToken } = useAuth();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('DIGITAL');
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [status, setStatus] = useState('');
  const [listedProducts, setListedProducts] = useState([]);

  const fetchProducts = () => {
    if (!user) return;
    fetch(`${API_URL}/api/products?sellerId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Force frontend filtering just in case the backend server wasn't restarted
          const myProducts = data.products.filter(p => p.sellerId === user.id);
          setListedProducts(myProducts);
        }
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus(t('uploading_product'));

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('type', type);
    if (file) {
      formData.append('file', file);
    }
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus(t('success_upload'));
        setTitle('');
        setPrice('');
        setFile(null);
        setCoverImage(null);
        fetchProducts();
      } else {
        setStatus(t('upload_failed') + data.error);
      }
    } catch (error) {
      setStatus(t('network_error'));
    }
  };

  const handleEdit = async (p) => {
    const newTitle = window.prompt("Enter new title for " + p.title, p.title);
    if (newTitle === null) return;
    const newPrice = window.prompt("Enter new price", p.price);
    if (newPrice === null) return;
    
    try {
      const response = await fetch(`${API_URL}/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle, price: newPrice })
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert("Edit failed: " + data.error);
      }
    } catch(err) {
      alert("Network error.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to completely remove this product?")) return;
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch(err) {
      alert("Network error.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      <div className="glass-panel" style={{ textAlign: 'start', maxWidth: '800px', width: '100%', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--accent-light-purple)' }}>{t('add_new_product')}</h2>
        
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>{t('product_title')}</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>{t('price')}</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>{t('product_type')}</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-dark-blue)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem' }}>
              <option value="DIGITAL">{t('digital_download')}</option>
              <option value="COURSE">{t('video_course')}</option>
              <option value="SERVICE">{t('schedulable_service')}</option>
            </select>
          </div>

          {type === 'DIGITAL' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.05)', padding: '1.5rem', border: '1px dashed rgba(56, 189, 248, 0.3)', borderRadius: '8px' }}>
              <label style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{t('upload_digital_file')}</label>
              <input type="file" onChange={e => setFile(e.target.files[0])} required style={{ color: 'var(--text-muted)' }} />
            </div>
          )}

          {type === 'SERVICE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(192, 132, 252, 0.05)', padding: '1.5rem', border: '1px dashed rgba(192, 132, 252, 0.3)', borderRadius: '8px' }}>
              <label style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>📅 Service Booking Setup</label>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Your service will automatically use your global <strong>Availability Matrix</strong>. The system will handle your time slots and completely prevent clients from double-booking!
              </p>
              <a href="/dashboard/availability" target="_blank" style={{ color: 'var(--accent-light-purple)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Configure my Available Hours &rarr;
              </a>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', border: '1px dashed rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}>
            <label style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Product Cover Image (Optional)</label>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Upload an eye-catching thumbnail to display on your storefront.</p>
            <input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files[0])} style={{ color: 'var(--text-muted)' }} />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start', padding: '12px 30px' }}>{t('save_product')}</button>
          {status && <p style={{ color: 'var(--accent-light-blue)', marginTop: '0.5rem', fontWeight: 'bold' }}>{status}</p>}
        </form>
      </div>

      <div className="glass-panel" style={{ textAlign: 'start', maxWidth: '800px', width: '100%', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('your_uploaded_products')}</h2>
        {listedProducts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>{t('no_products_uploaded')}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {listedProducts.map(p => (
              <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {p.title} 
                      <span style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '6px', color: 'var(--accent-light-blue)' }}>{p.type}</span>
                    </h4>
                    {p.type === 'DIGITAL' && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('status_active')}</p>}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent-light-purple)' }}>
                    ${p.price.toFixed(2)}
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button 
                    onClick={() => handleEdit(p)}
                    style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.2)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



