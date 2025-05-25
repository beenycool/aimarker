/** @type {import('next').NextConfig} */
const path = require('path');

const isCloudflarePages = process.env.CF_PAGES === '1';

const nextConfig = {
  reactStrictMode: true,
  // For Cloudflare Pages, use static export
  ...(isCloudflarePages ? { 
    output: 'export',
    images: { unoptimized: true },
    distDir: '.cloudflare_dist',
    trailingSlash: true,
  } : {}),
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  env: {
    // Use environment variables or default values
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://beenycool-github-io.onrender.com',
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Pass CF_PAGES to the client to help with conditional logic
    NEXT_PUBLIC_CF_PAGES: isCloudflarePages ? '1' : '0'
  },
  webpack: (config, { dev, isServer }) => {
    // Add optimization settings
    if (!dev && !isServer) {
      config.optimization.minimize = false;
      config.optimization.minimizer = config.optimization.minimizer || [];
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
      'react': reactPath,
      'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      'react/jsx-runtime': path.join(reactPath, 'jsx-runtime')
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

module.exports = nextConfig; 