'use client';

import { AuthProvider } from '../providers/AuthProvider';
import Navbar from '../components/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Hidden Gems - Discover Underrated Music & Movies</title>
        <meta name="description" content="Discover and share underrated music and movies from around the world. Join our community of music and film enthusiasts." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Hidden Gems - Discover Underrated Music & Movies" />
        <meta property="og:description" content="Discover and share underrated music and movies from around the world." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
