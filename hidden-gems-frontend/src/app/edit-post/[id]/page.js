'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { postAPI } from '../../../services/api';
import { AuthContext } from '../../../providers/AuthProvider';

export default function EditPost() {
  const context = useContext(AuthContext);
  const user = context?.user;
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    review: '',
    type: 'music',
    genre: '',
    country: '',
    language: '',
    year: '',
    rating: 5,
    externalLink: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (id) {
      postAPI.getById(id)
        .then(res => {
          setForm(res.data);
          setLoading(false);
        })
        .catch(err => {
          alert('Post not found');
          router.push('/dashboard');
        });
    }
  }, [id, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await postAPI.update(id, form);
      alert('Post updated successfully!');
      router.push('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update post');
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Edit Post</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              style={styles.input}
              disabled={submitting}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={styles.input}
              disabled={submitting}
            >
              <option value="music">Music</option>
              <option value="movie">Movie</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Genre</label>
            <input
              type="text"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              style={styles.input}
              disabled={submitting}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={styles.textarea}
              disabled={submitting}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Review</label>
            <textarea
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              required
              style={styles.textarea}
              disabled={submitting}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                style={styles.input}
                disabled={submitting}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Language</label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                style={styles.input}
                disabled={submitting}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                style={styles.input}
                disabled={submitting}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Rating: {form.rating} ⭐</label>
            <input
              type="range"
              min="1"
              max="5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              style={styles.slider}
              disabled={submitting}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>External Link (Spotify, YouTube, IMDb)</label>
            <input
              type="url"
              value={form.externalLink}
              onChange={(e) => setForm({ ...form, externalLink: e.target.value })}
              style={styles.input}
              disabled={submitting}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Post'}
            </button>
            <button type="button" onClick={() => router.push('/dashboard')} style={styles.cancelBtn} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: 'calc(100vh - 70px)', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  container: { maxWidth: '700px', margin: '0 auto', padding: '2.5rem', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
  loading: { textAlign: 'center', padding: '3rem', color: '#fff', fontSize: '1.2rem' },
  title: { fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#333', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column' },
  inputGroup: { marginBottom: '1.5rem' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333', fontSize: '0.95rem' },
  input: { width: '100%', padding: '0.8rem', fontSize: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px', outline: 'none', transition: 'border-color 0.3s' },
  textarea: { width: '100%', padding: '0.8rem', fontSize: '1rem', minHeight: '100px', border: '2px solid #e0e0e0', borderRadius: '8px', outline: 'none', resize: 'vertical' },
  slider: { width: '100%', marginTop: '0.5rem', height: '8px', borderRadius: '5px', outline: 'none' },
  buttonGroup: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  submitBtn: { flex: 1, padding: '0.9rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'background 0.3s' },
  cancelBtn: { flex: 1, padding: '0.9rem', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
};
