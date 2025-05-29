/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  output: 'export', // Add this for static export
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: 'backend/.next',
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://beenycool-github-io.onrender.com',
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
    };
    return config;
  },
  experimental: {
    appDir: true
  },
  staticPageGenerationTimeout: 300,
}

module.exports = nextConfig; 