import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Storefront() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const { user: authenticatedUser } = useAuth();
  const navigate = useNavigate();
  
  const [storeOwner, setStoreOwner] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    // 1. Fetch Store Owner by slug
    fetch(`${API_URL}/api/auth/by-slug/${slug}`)
      .then(res => res.json())
      .then(userData => {
        if (userData.success) {
          setStoreOwner(userData.user);
          // 2. Fetch products specifically for this user's ID
          return fetch(`${API_URL}/api/products?sellerId=${userData.user.id}`);
        } else {
          throw new Error('Storefront not found');
        }
      })
      .then(res => res.json())
      .then(productData => {
        if (productData.success) {
          setProducts(productData.products);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const isRtl = true; // Forcing RTL for Arabic default feel just like Nzmly
  const isOwner = authenticatedUser && storeOwner && authenticatedUser.id === storeOwner.id;

  return (
    <div className="storefront-container" style={{ padding: '0 0 2rem 0', width: '100%', position: 'relative' }}>
      
      {/* Cover Banner */}
      <div style={{ 
        width: '100%', 
        height: '250px', 
        background: 'linear-gradient(90deg, rgba(30,27,75,1) 0%, rgba(88,28,135,1) 100%)',
        position: 'relative'
      }}>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        {/* Profile Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent-light-blue), var(--accent-light-purple))',
            border: '4px solid var(--bg-main)',
            position: 'relative',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
             {storeOwner?.profilePic && (
                <img src={storeOwner.profilePic.startsWith('http') ? storeOwner.profilePic : `${API_URL}${storeOwner.profilePic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
             )}
             {/* Verified Badge */}
            <div style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              background: 'var(--accent-light-purple)',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              border: '2px solid var(--bg-main)'
            }}>✓</div>
          </div>
          
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem', fontWeight: 'bold' }}>{storeOwner ? storeOwner.name : 'Creator'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>{storeOwner ? storeOwner.role : 'Loading...'}</p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('products')}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '50px', 
              border: 'none',
              background: activeTab === 'products' ? 'var(--accent-light-purple)' : 'transparent',
              color: activeTab === 'products' ? 'white' : 'var(--text-muted)',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.2s'
            }}
          >
            {t('products')}
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '50px', 
              border: 'none',
              background: activeTab === 'about' ? 'var(--accent-light-purple)' : 'transparent',
              color: activeTab === 'about' ? 'white' : 'var(--text-muted)',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.2s'
            }}
          >
            {i18n.language === 'ar' ? 'عني' : 'About Me'}
          </button>

          {isOwner && (
            <button 
              onClick={() => navigate('/dashboard')}
              style={{ 
                padding: '10px 24px', 
                borderRadius: '50px', 
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1.1rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.05)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--text-muted)';
              }}
            >
              {i18n.language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'about' ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: isRtl ? 'right' : 'left', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--accent-light-purple)' }}>من أنا؟</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
              {storeOwner ? storeOwner.bio : ''}
            </p>
          </div>
        ) : (
          <div>
            {loading ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>{t('loading_products')}</p>
            ) : products.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>{t('no_storefront_products')}</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', direction: isRtl ? 'rtl' : 'ltr' }}>
                {products.map(product => (
                  <div key={product.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', textAlign: isRtl ? 'right' : 'left', minHeight: '350px', borderRadius: '24px' }}>
                    <div style={{ height: '180px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '2px', overflow: 'hidden' }}>
                      {product.coverImagePath ? (
                        <img src={product.coverImagePath.startsWith('http') ? product.coverImagePath : `${API_URL}${product.coverImagePath}`} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        `[${product.type} Cover]`
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{product.title}</h3>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-light-purple)', marginTop: 'auto', marginBottom: '1.5rem' }}>${product.price ? product.price.toFixed(2) : '0.00'}</p>
                    {product.type === 'SERVICE' ? (
                      <Link to={`/products/${product.id}`} className="btn-primary" style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', margin: 0, display: 'flex', boxSizing: 'border-box', borderRadius: '50px', padding: '12px' }}>
                        {t('book_session')}
                      </Link>
                    ) : (
                      <Link to={`/products/${product.id}`} className="btn-primary" style={{ textDecoration: 'none', width: '100%', justifyContent: 'center', margin: 0, display: 'flex', boxSizing: 'border-box', borderRadius: '50px', padding: '12px' }}>
                        {t('buy_now')}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



