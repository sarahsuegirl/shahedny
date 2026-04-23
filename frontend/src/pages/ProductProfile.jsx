import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';

export default function ProductProfile() {
  const { productId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    // In a real app we'd fetch the product by ID from the backend.
    // Since we only have a GET /api/products route, let's fetch all and filter.
    // We should ideally have GET /api/products/:id, let's try that or fallback.
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.products.find(p => p.id.toString() === productId);
          setProduct(found);
          // Dummy seller data for now since we don't have user profiles returned per product easily in this mock
          setSeller({
            name: "Sarah (Demo Creator)",
            bio: "Persona Builder | Copywriter",
            avatar: "linear-gradient(135deg, var(--accent-light-blue), var(--accent-light-purple))"
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  const handleAction = () => {
    if (!product) return;
    if (product.type === 'SERVICE') {
      navigate(`/book/${product.id}`);
    } else {
      navigate(`/checkout/${product.id}`);
    }
  };

  const isRtl = i18n.language.startsWith('ar');

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!product) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Product not found</div>;
  }

  return (
    <div className="product-profile-container" style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '2rem',
      padding: '2rem 1rem'
    }}>
      {/* Profile Header (Storefront look) */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        padding: '1.5rem',
        borderRadius: '16px',
        justifyContent: isRtl ? 'flex-start' : 'flex-start',
      }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          background: seller?.avatar,
          flexShrink: 0 
        }} />
        <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {seller?.name}
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'var(--accent-light-purple)', 
              color: 'white', 
              borderRadius: '50%', 
              width: '16px', 
              height: '16px', 
              fontSize: '0.7rem' 
            }}>✓</span>
          </h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{seller?.bio}</p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isRtl ? 'row-reverse' : 'row',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        
        {/* Left/Right Column: Main Content (70%) */}
        <div style={{ flex: '1 1 65%', minWidth: '300px' }}>
          <div className="glass-panel" style={{ 
            height: '400px', 
            borderRadius: '24px', 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px dashed rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            <span style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>{product.type}</span>
          </div>

          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            textAlign: isRtl ? 'right' : 'left'
          }}>
            {product.title}
          </h1>

          <div style={{ 
            color: 'var(--text-main)', 
            lineHeight: 1.8, 
            fontSize: '1.1rem',
            textAlign: isRtl ? 'right' : 'left'
          }}>
            <p>
              {t('hero_subtitle')} This is a high-quality {product.type.toLowerCase()} 
              designed to provide extreme value. Built with exactly what you need in mind.
            </p>
            <ul style={{ paddingInlineStart: '1.5rem', marginTop: '1rem' }}>
              <li>Premium quality content</li>
              <li>Instant access upon purchase</li>
              <li>Lifetime updates and support</li>
            </ul>
          </div>
        </div>

        {/* Left/Right Column: Sticky Checkout Card (30%) */}
        <div style={{ flex: '0 1 30%', minWidth: '300px' }}>
          <div className="glass-panel" style={{ 
            position: 'sticky', 
            top: '2rem',
            padding: '2rem',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            background: 'var(--bg-glass)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          }}>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  color: 'var(--accent-light-purple)' 
                }}>
                  ${product.price ? product.price.toFixed(2) : '0.00'}
                </span>
                {product.price > 0 && (
                  <span style={{ 
                    padding: '4px 12px', 
                    background: 'rgba(74, 222, 128, 0.2)', 
                    color: '#4ade80', 
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    33% OFF
                  </span>
                )}
              </div>
              {product.price > 0 && (
                <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1.2rem' }}>
                  ${(product.price * 1.5).toFixed(2)}
                </span>
              )}
            </div>

            <button 
              onClick={handleAction}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '50px',
                background: 'var(--accent-light-purple)',
                color: 'white',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s transform',
                boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {product.type === 'SERVICE' ? t('book_session') : t('buy_now')}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{t('secure_payment')}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {['💳', '🍎', 'G', '⚡'].map((icon, i) => (
                  <div key={i} style={{ 
                    width: '40px', 
                    height: '30px', 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
