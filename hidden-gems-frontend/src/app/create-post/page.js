'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postAPI } from '@/services/api';

export default function CreatePost() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(2.5);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    genre: '',
    description: '',
    review: '',
    country: '',
    language: '',
    year: '',
    watchLink: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await postAPI.create({
        title: formData.title,
        type: formData.type.toLowerCase(),
        genre: formData.genre,
        description: formData.description,
        review: formData.review,
        country: formData.country,
        language: formData.language,
        year: formData.year,
        rating: rating,
      });

      alert('✅ Post created successfully!');
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="create-post-page">
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="create-post-btn"
        >
          🎬 Create New Post
        </button>
      )}

      {showForm && (
        <div className="create-post">
          <h2>Create a New Post</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Enter Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="music">Music</option>
              <option value="movie">Movie</option>
            </select>

            <input
              type="text"
              name="genre"
              placeholder="Genre (e.g. Action, Drama)"
              value={formData.genre}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              rows="4"
              placeholder="Short Description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <textarea
              name="review"
              rows="6"
              placeholder="Write your Review..."
              value={formData.review}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
            />

            <input
              type="text"
              name="language"
              placeholder="Language"
              value={formData.language}
              onChange={handleChange}
            />

            <input
              type="text"
              name="year"
              placeholder="Release Year"
              value={formData.year}
              onChange={handleChange}
            />

            <label className="rating-label">
              Rating: <span id="ratingValue">{rating.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              className="slider"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Post'}
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .create-post-page {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #e0f7fa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100vh;
        }

        .create-post-btn {
          margin-top: 40px;
          background: #0b7ff2;
          color: #fff;
          border: none;
          padding: 14px 28px;
          font-size: 1.1rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(11, 127, 242, 0.5);
        }

        .create-post-btn:hover {
          background-color: #4194f2;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(11, 127, 242, 0.7);
        }

        .create-post {
          max-width: 650px;
          width: 90%;
          margin: 40px auto;
          padding: 30px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          animation: fadeIn 0.6s ease;
        }

        .create-post h2 {
          text-align: center;
          margin-bottom: 25px;
          color: #90caf9;
          font-size: 1.8rem;
          letter-spacing: 1px;
        }

        .error-message {
          background: rgba(229, 9, 20, 0.2);
          border: 1px solid #e50914;
          color: #ff6b6b;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 14px;
          text-align: center;
        }

        form input[type="text"],
        form select,
        form textarea {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          outline: none;
          transition: background 0.3s ease;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        form input::placeholder,
        form textarea::placeholder {
          color: #bbb;
        }

        form input:focus,
        form textarea:focus,
        form select:focus {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 8px rgba(11, 127, 242, 0.5);
        }

        form select {
          cursor: pointer;
        }

        form select option {
          background: #203a43;
          color: #fff;
        }

        .rating-label {
          font-size: 1rem;
          margin-bottom: 8px;
          display: block;
          color: #e0f7fa;
          font-weight: 500;
        }

        .slider {
          width: 100%;
          accent-color: #0b7ff2;
          margin-bottom: 20px;
          cursor: pointer;
        }

        button[type="submit"] {
          background-color: #0b7ff2;
          color: #fff;
          border: none;
          padding: 12px 22px;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          display: block;
          margin: 0 auto;
          width: 100%;
        }

        button[type="submit"]:hover:not(:disabled) {
          background-color: #4194f2;
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(11, 127, 242, 0.7);
        }

        button[type="submit"]:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .create-post {
            padding: 20px;
          }

          .create-post-btn {
            margin-top: 20px;
            font-size: 1rem;
            padding: 12px 20px;
          }
        }
      `}</style>
    </div>
  );
}
