import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext({ user: null, loading: false, login: () => {}, logout: () => {}, getToken: () => null });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('shahedny_token');
    if (token) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setUser(data.user);
          else localStorage.removeItem('shahedny_token');
        })
        .catch(() => localStorage.removeItem('shahedny_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('shahedny_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('shahedny_token');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('shahedny_token');

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) return { user: null, loading: false, login: () => {}, logout: () => {}, getToken: () => null };
  return ctx;
}



