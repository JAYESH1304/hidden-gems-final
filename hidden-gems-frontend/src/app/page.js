'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="home-page">
      <div className="overlay"></div>

      <Link href="/" className="logo-link">
        <div className="logo"></div>
      </Link>

      <div className="review-box">
        <p>Start and share your amazing reviews</p>
        <div className="button-container">
          <Link href="/register">
            <button className="btn">Register</button>
          </Link>
          <Link href="/login">
            <button className="btn">Login</button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .home-page {
          font-family: 'Poppins', sans-serif;
          text-align: center;
          margin: 0;
          padding: 0;
          color: #FFFFFF;
          background-image: url('/background.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 0;
        }

        .logo-link {
          position: relative;
          z-index: 1;
          cursor: pointer;
        }

        .logo {
          width: 150px;
          height: 175px;
          border-radius: 20px;
          margin: 60px auto 20px;
          background-image: url('/Cinecircle.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          box-shadow: 0 0 25px rgba(245, 166, 35, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(245, 166, 35, 0.5);
        }

        .review-box {
          position: relative;
          z-index: 1;
          background-color: rgba(28, 28, 28, 0.95);
          border: 2px solid #F5A623;
          border-radius: 25px;
          width: 400px;
          margin: 40px auto;
          padding: 30px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .review-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 35px rgba(245, 166, 35, 0.3);
        }

        .review-box p {
          color: #F5A623;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 25px;
        }

        .button-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .btn {
          border: 2px solid #F5A623;
          border-radius: 25px;
          color: #F5A623;
          background-color: transparent;
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn:hover {
          background: #E50914;
          color: #FFFFFF;
          border-color: #E50914;
          box-shadow: 0 0 20px #E50914;
          transform: scale(1.05);
        }

        @media (max-width: 600px) {
          .review-box {
            width: 85%;
            padding: 20px;
          }

          .logo {
            width: 120px;
            height: 140px;
            margin: 40px auto 20px;
          }

          .btn {
            padding: 10px 25px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
