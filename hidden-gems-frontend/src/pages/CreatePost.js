import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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
    try {
      await postAPI.create(form);
      alert('Post created successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create post');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create New Post</h2>
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
};

const styles = {
  container: { maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc' },
  form: { display: 'flex', flexDirection: 'column' },
  input: { margin: '0.5rem 0', padding: '0.7rem', fontSize: '1rem' },
  textarea: { margin: '0.5rem 0', padding: '0.7rem', fontSize: '1rem', minHeight: '100px' },
  label: { margin: '0.5rem 0' },
  slider: { width: '100%', marginTop: '0.5rem' },
  button: { marginTop: '1rem', padding: '0.7rem', cursor: 'pointer', fontSize: '1rem' },
};

export default CreatePost;
