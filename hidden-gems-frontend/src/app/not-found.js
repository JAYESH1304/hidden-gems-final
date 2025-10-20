'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Page Not Found</h2>
        <p style={styles.text}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div style={styles.buttons}>
          <Link href="/" style={styles.homeBtn}>Go Home</Link>
          <Link href="/dashboard" style={styles.dashboardBtn}>My Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' },
  content: { textAlign: 'center', color: '#fff', maxWidth: '600px' },
  title: { fontSize: '8rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '4px 4px 8px rgba(0,0,0,0.3)' },
  subtitle: { fontSize: '2.5rem', marginBottom: '1rem' },
  text: { fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 },
  buttons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  homeBtn: { padding: '0.9rem 2rem', background: '#fff', color: '#667eea', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem' },
  dashboardBtn: { padding: '0.9rem 2rem', background: '#28a745', color: '#fff', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem' },
};
