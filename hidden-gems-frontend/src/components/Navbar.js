'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const context = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    context?.logout();
    router.push('/');
  };

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.logo}>
        <h2>🎬🎵 Hidden Gems</h2>
      </Link>
      <div style={styles.navLinks}>
        {context?.user ? (
          <>
            <Link href="/dashboard" style={styles.link}>📊 Dashboard</Link>
            <span style={styles.username}>👤 {context.user.username}</span>
            <Link href="/create-post" style={styles.createBtn}>+ Create Post</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={styles.link}>Login</Link>
            <Link href="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '1rem 2rem', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  logo: { color: '#fff', textDecoration: 'none', fontSize: '1.5rem' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' },
  username: { fontSize: '1rem', fontWeight: 'bold' },
  createBtn: { 
    padding: '0.5rem 1rem', 
    background: '#28a745', 
    color: '#fff', 
    textDecoration: 'none', 
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  registerBtn: {
    padding: '0.5rem 1rem',
    background: '#fff',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  logoutBtn: { 
    padding: '0.5rem 1rem', 
    cursor: 'pointer', 
    background: '#dc3545', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '5px',
    fontWeight: 'bold',
  },
};

export default Navbar;
