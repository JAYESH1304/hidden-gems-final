'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/services/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop all event propagation
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password!');
      return false;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      console.log('✅ Login successful!');
      
      // Store credentials
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('loggedInUser', formData.email);
      
      // Show success screen
      setLoginSuccess(true);
      setLoading(false);
      
      console.log('Redirecting in 2 seconds...');
      
      // Redirect after showing success
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
    
    return false; // Prevent any default behavior
  };

  // Success screen
  if (loginSuccess) {
    return (
      <div className="login-page">
        <div className="overlay"></div>
        <div className="login-container success-container">
          <div className="success-icon">✅</div>
          <h2 className="success-title">Login Successful!</h2>
          <p className="tagline">Redirecting to dashboard...</p>
          <Link href="/dashboard">
            <button className="dashboard-btn">Go to Dashboard Now</button>
          </Link>
        </div>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

          .login-page {
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

          .success-container {
            position: relative;
            z-index: 1;
            background: rgb(38, 37, 37);
            padding: 40px;
            border-radius: 25px;
            text-align: center;
            width: 300px;
            box-shadow: 0 0 30px rgba(76, 175, 80, 0.5);
            animation: successPulse 1s ease-in-out;
          }

          .success-icon {
            font-size: 72px;
            margin-bottom: 20px;
            animation: bounce 0.6s ease-in-out;
          }

          .success-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #4caf50 !important;
            font-size: 24px;
          }

          .tagline {
            font-size: 14px;
            color: #ccc;
            margin-bottom: 25px;
          }

          .dashboard-btn {
            width: 100%;
            background-color: #4caf50;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
          }

          .dashboard-btn:hover {
            background-color: #66bb6a;
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(76, 175, 80, 0.8);
          }

          @keyframes successPulse {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  // Login form
  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-container">
        <div className="logo"></div>
        <h2>Welcome Back to <span>Cine Circle</span></h2>
        <p className="tagline">Where you can share your taste with everyone..🎬</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} method="dialog">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">
          Don&apos;t have an account? <a href="/register">Sign up</a>
        </p>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .login-page {
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

        .login-container {
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

        .login-container:hover {
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

        input:disabled {
          opacity: 0.6;
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

        .signup-link {
          margin-top: 20px;
          font-size: 14px;
          color: #ccc;
        }

        .signup-link a {
          color: #f5a623;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .signup-link a:hover {
          color: #e50914;
        }

        @media (max-width: 400px) {
          .login-container {
            width: 90%;
            padding: 25px;
          }
        }
      `}</style>
    </div>
  );
}
