import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}
