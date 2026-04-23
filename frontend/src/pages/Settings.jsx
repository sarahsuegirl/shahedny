import React, { useState } from 'react';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // States corresponding to our Nezmly-cloned storefront data
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  
  const [status, setStatus] = useState('');

  // Load existing profile from backend via slug
  // We use user name as initial slug to find their profile
  React.useEffect(() => {
    if (!user) return;
    const initialSlug = user.name.toLowerCase().replace(/\s+/g, '');
    fetch(`${API_URL}/api/auth/by-slug/${initialSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSlug(data.user.slug || '');
          setDisplayName(data.user.name || '');
          setRole(data.user.role || '');
          setBio(data.user.bio || '');
        }
      });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    
    // We must import getToken from useAuth
    const form = new FormData();
    form.append('slug', slug);
    form.append('displayName', displayName);
    form.append('role', role);
    form.append('bio', bio);
    if (profilePicFile) {
      form.append('profilePic', profilePicFile);
    }

    try {
      // NOTE: getToken is expected from AuthContext
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('shahedny_token')}` },
        body: form
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus('Profile updated successfully!');
      } else {
        setStatus('Failed to update: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      setStatus('Save failed. Have you hit "restart" on your local backend server recently? (JSON parsing error)');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', textAlign: 'start' }}>
      
      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', width: '100%' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--accent-light-purple)' }}>Storefront Profile Settings</h2>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--accent-light-blue), var(--accent-light-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              overflow: 'hidden'
            }}>
              {profilePicFile ? (
                <img src={URL.createObjectURL(profilePicFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                '+ Image'
              )}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setProfilePicFile(e.target.files[0])} />
            </label>
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>Profile Picture</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upload a picture to show on your storefront.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>Storefront URL (Slug)</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <span style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>nzmly.com/s/</span>
              <input 
                type="text" 
                value={slug} 
                onChange={e => setSlug(e.target.value)} 
                required 
                style={{ padding: '12px', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1rem', width: '100%', outline: 'none' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>Display Name</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={e => setDisplayName(e.target.value)} 
              required 
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>Role / Title</label>
            <input 
              type="text" 
              value={role} 
              onChange={e => setRole(e.target.value)} 
              placeholder="e.g. Graphic Designer | UI/UX"
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-muted)' }}>"About Me" Bio</label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              rows="6"
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1rem', resize: 'vertical' }} 
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>This supports Arabic formatting (RTL) out of the box.</p>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start', padding: '12px 30px' }}>
            Save Profile
          </button>
          
          {status && (
            <p style={{ color: status.includes('success') ? '#4ade80' : 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 'bold' }}>
              {status}
            </p>
          )}
        </form>
      </div>
      
    </div>
  );
}
