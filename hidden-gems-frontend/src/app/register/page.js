'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Auto-login after registration
      const loginResponse = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('email', formData.email);
      localStorage.setItem('isLoggedIn', 'true');

      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="overlay"></div>

      <div className="register-container">
        <div className="logo"></div>
        <h2>Join <span>Cine Circle</span> Today</h2>
        <p className="tagline">Where you can share your taste with everyone..🎬</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .register-page {
          position: fixed;
          inset: 0;
          background: url('/background.jpeg') no-repeat center center fixed;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-family: 'Poppins', sans-serif;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 0;
        }

        .register-container {
          position: relative;
          z-index: 1;
          background: rgb(38, 37, 37);
          padding: 40px;
          border-radius: 25px;
          text-align: center;
          width: 300px;
          box-shadow: 0 0 30px rgba(245, 166, 35, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .register-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 40px rgba(182, 136, 63, 0.89);
        }

        .logo {
          width: 90px;
          height: 100px;
          background: url('/Cinecircle.png') no-repeat center;
          background-size: contain;
          margin: 0 auto 20px;
        }

        h2 {
          font-weight: 600;
          margin-bottom: 5px;
          color: #f5a623;
          font-size: 20px;
        }

        h2 span {
          color: #e50914;
        }

        .tagline {
          font-size: 14px;
          color: #ccc;
          margin-bottom: 25px;
        }

        .error-message {
          background: rgba(229, 9, 20, 0.2);
          border: 1px solid #e50914;
          color: #ff6b6b;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border-radius: 10px;
          border: 1px solid #f5a623;
          background: transparent;
          color: #fff;
          outline: none;
          font-size: 14px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        input::placeholder {
          color: #ccc;
        }

        input:focus {
          border-color: #e50914;
          box-shadow: 0 0 10px #e50914;
        }

        button {
          width: 100%;
          background-color: #ff2e2e;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 8px rgba(255, 46, 46, 0.6);
          margin-top: 10px;
        }

        button:hover:not(:disabled) {
          background-color: #ff4b2b;
          box-shadow: 0 0 15px rgba(255, 75, 43, 0.9), 0 0 25px rgba(255, 75, 43, 0.5);
          transform: scale(1.05);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-link {
          margin-top: 20px;
          font-size: 14px;
          color: #ccc;
        }

        .login-link a {
          color: #f5a623;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .login-link a:hover {
          color: #e50914;
        }

        @media (max-width: 400px) {
          .register-container {
            width: 90%;
            padding: 25px;
          }
        }
      `}</style>
    </div>
  );
}
