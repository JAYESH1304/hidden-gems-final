
'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { postAPI } from '../../services/api';
import { AuthContext } from '../../providers/AuthProvider';

export default function CreatePost() {
  const context = useContext(AuthContext);
  const user = context?.user;
  const router = useRouter();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to create a post');
      router.push('/login');
      return;
    }
    try {
      await postAPI.create(form);
      alert('Post created successfully!');
      router.push('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create post');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Post</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          style={styles.input}
        />
        
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          style={styles.input}
        >
          <option value="music">Music</option>
          <option value="movie">Movie</option>
        </select>

        <input
          type="text"
          placeholder="Genre (e.g., indie, thriller)"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
          style={styles.input}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={styles.textarea}
        />

        <textarea
          placeholder="Review"
          value={form.review}
          onChange={(e) => setForm({ ...form, review: e.target.value })}
          required
          style={styles.textarea}
        />

        <input
          type="text"
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Language"
          value={form.language}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          style={styles.input}
        />

        <label style={styles.label}>
          Rating: {form.rating}
          <input
            type="range"
            min="1"
            max="5"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            style={styles.slider}
          />
        </label>

        <input
          type="url"
          placeholder="External Link (Spotify, YouTube, IMDb)"
          value={form.externalLink}
          onChange={(e) => setForm({ ...form, externalLink: e.target.value })}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Create Post</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  title: { fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', color: '#333' },
  form: { display: 'flex', flexDirection: 'column' },
  input: { margin: '0.5rem 0', padding: '0.8rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '8px' },
  textarea: { margin: '0.5rem 0', padding: '0.8rem', fontSize: '1rem', minHeight: '100px', border: '1px solid #ddd', borderRadius: '8px' },
  label: { margin: '0.5rem 0', fontWeight: '500' },
  slider: { width: '100%', marginTop: '0.5rem' },
  button: { marginTop: '1rem', padding: '0.8rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
};
