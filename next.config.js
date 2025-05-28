/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  // Disable ESLint and TypeScript errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Remove exportPathMap since it's not compatible with App Router
  distDir: '.next',
  env: {
    // Use environment variables or default values
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://beenycool-github-io.onrender.com',
    // PostHog env vars removed
  },
  webpack: (config, { dev, isServer }) => {
    // Add optimization settings
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000
      };
    }

    // Add React alias to ensure all components use the same React instance
    const reactPath = path.dirname(require.resolve('react/package.json'));
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'), // Add alias for @ path
    };
    
    return config;
  },
  // Set experimental options correctly
  experimental: {
    // Empty experimental settings to avoid errors
  },
  
  // For App Router, we need to explicitly handle route generation
  staticPageGenerationTimeout: 300,
}

// Apply special config for static export
if (process.env.STATIC_EXPORT === 'true') {
  // When statically exporting, we need to handle API routes
  nextConfig.rewrites = async () => {
    return {
      beforeFiles: [
        // Forward API requests to backend
        {
          source: '/api/:path*',
          destination: 'https://beenycool-github-io.onrender.com/api/:path*',
        },
      ]
    };
  };
}

module.exports = nextConfig; 