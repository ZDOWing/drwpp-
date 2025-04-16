import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  webpack: (config, { isServer }) => {
    // Add path alias configuration to webpack
    if (config.resolve) {
      if (!config.resolve.alias) {
        config.resolve.alias = {};
      }
      
      // Define path aliases
      Object.assign(config.resolve.alias, {
        '@': path.resolve('./'),
        '@components': path.resolve('./components'),
        '@lib': path.resolve('./lib'),
        '@app': path.resolve('./app'),
      });
    } else {
      config.resolve = { 
        alias: { 
          '@': path.resolve('./'),
          '@components': path.resolve('./components'),
          '@lib': path.resolve('./lib'),
          '@app': path.resolve('./app'),
        } 
      };
    }
    
    return config;
  },
}

// Configuration simplifiée pour le déploiement sur Render

export default nextConfig
