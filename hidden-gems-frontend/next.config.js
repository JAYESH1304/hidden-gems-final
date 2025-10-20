/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {}
  },
  // Disable static page generation for dynamic auth pages
  output: 'standalone',
}

module.exports = nextConfig
