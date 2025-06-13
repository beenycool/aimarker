/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.aimarker.tech',
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Enhanced code splitting configuration
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 30,
        minSize: 15000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 244000
          },
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            priority: 10,
            chunks: 'all'
          },
          games: {
            test: /[\\/]app[\\/]games[\\/]/,
            name: 'games',
            priority: 5,
            chunks: 'all'
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            priority: 8,
            chunks: 'all'
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 7,
            chunks: 'all'
          }
        }
      };
      
      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = [
        '**/*.css',
        '**/*.scss',
        '**/globals.css'
      ];
      
      // Module concatenation
      config.optimization.concatenateModules = true;
      
      // Minimize CSS
      config.optimization.minimize = true;
    }
    
    // Bundle analyzer for development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
    };
    return config;
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  staticPageGenerationTimeout: 300,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig;