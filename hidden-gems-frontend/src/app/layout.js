import './globals.css';

export const metadata = {
  title: 'Cine Circle',
  description: 'Share your amazing reviews',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
