'use client';
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { postAPI } from '../../services/api';
import { AuthContext } from '../../providers/AuthProvider';
import Link from 'next/link';

export default function Dashboard() {
  const context = useContext(AuthContext);
  const user = context?.user;
  const loading = context?.loading;
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      postAPI.getByUser()
        .then(res => setPosts(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoadingPosts(false));
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postAPI.delete(id);
      setPosts(posts.filter(p => p._id !== id));
      alert('Post deleted successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete post');
    }
  };

  if (loading || loadingPosts) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Dashboard</h1>
          <p style={styles.subtitle}>Welcome back, {user?.username}!</p>
        </div>

        <div style={styles.statsBar}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{posts.length}</div>
            <div style={styles.statLabel}>Total Posts</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{posts.filter(p => p.type === 'music').length}</div>
            <div style={styles.statLabel}>Music Posts</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{posts.filter(p => p.type === 'movie').length}</div>
            <div style={styles.statLabel}>Movie Posts</div>
          </div>
        </div>

        <div style={styles.actions}>
          <Link href="/create-post" style={styles.createBtn}>+ Create New Post</Link>
          <Link href="/" style={styles.browseBtn}>Browse All Posts</Link>
        </div>

        <h2 style={styles.sectionTitle}>Your Posts</h2>
        
        {posts.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>📝</p>
            <p style={styles.emptyText}>You haven&apos;t created any posts yet.</p>
            <Link href="/create-post" style={styles.emptyBtn}>Create Your First Post</Link>
          </div>
        ) : (
          <div style={styles.postsGrid}>
            {posts.map(post => (
              <div key={post._id} style={styles.postCard}>
                <div style={styles.postBadge}>{post.type}</div>
                <h3 style={styles.postTitle}>{post.title}</h3>
                <p style={styles.postMeta}>{post.genre} | {post.year}</p>
                <p style={styles.postRating}>{'⭐'.repeat(post.rating)}</p>
                <p style={styles.postDesc}>{post.description?.substring(0, 100)}...</p>
                
                <div style={styles.postActions}>
                  <Link href={`/post/${post._id}`} style={styles.viewBtn}>View</Link>
                  <Link href={`/edit-post/${post._id}`} style={styles.editBtn}>Edit</Link>
                  <button onClick={() => handleDelete(post._id)} style={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: 'calc(100vh - 70px)', paddingBottom: '3rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  loading: { textAlign: 'center', color: '#fff', padding: '3rem', fontSize: '1.2rem' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  header: { textAlign: 'center', color: '#fff', marginBottom: '2rem' },
  title: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' },
  subtitle: { fontSize: '1.2rem', opacity: 0.9 },
  statsBar: { display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' },
  statCard: { background: 'rgba(255,255,255,0.95)', padding: '1.5rem 2rem', borderRadius: '12px', textAlign: 'center', minWidth: '150px' },
  statNumber: { fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' },
  statLabel: { fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' },
  createBtn: { padding: '0.8rem 2rem', background: '#28a745', color: '#fff', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' },
  browseBtn: { padding: '0.8rem 2rem', background: '#fff', color: '#667eea', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' },
  sectionTitle: { fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', textAlign: 'center' },
  emptyState: { textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.95)', borderRadius: '16px' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  emptyText: { fontSize: '1.2rem', color: '#666', marginBottom: '2rem' },
  emptyBtn: { display: 'inline-block', padding: '0.8rem 2rem', background: '#667eea', color: '#fff', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' },
  postsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  postCard: { background: '#fff', padding: '1.5rem', borderRadius: '12px', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  postBadge: { position: 'absolute', top: '10px', right: '10px', background: '#667eea', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' },
  postTitle: { fontSize: '1.3rem', marginBottom: '0.5rem', color: '#333' },
  postMeta: { color: '#777', fontSize: '0.9rem', marginBottom: '0.5rem' },
  postRating: { fontSize: '1.1rem', marginBottom: '0.5rem' },
  postDesc: { color: '#666', lineHeight: '1.5', marginBottom: '1rem' },
  postActions: { display: 'flex', gap: '0.5rem', justifyContent: 'space-between' },
  viewBtn: { padding: '0.5rem 1rem', background: '#007bff', color: '#fff', borderRadius: '5px', textDecoration: 'none', cursor: 'pointer', fontWeight: '500', textAlign: 'center', flex: 1 },
  editBtn: { padding: '0.5rem 1rem', background: '#ffc107', color: '#000', borderRadius: '5px', textDecoration: 'none', cursor: 'pointer', fontWeight: '500', textAlign: 'center', flex: 1 },
  deleteBtn: { padding: '0.5rem 1rem', background: '#dc3545', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: '500', flex: 1 },
};
