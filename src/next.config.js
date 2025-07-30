
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Forcing a rebuild by explicitly setting a config value.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['@/components'] = path.resolve(__dirname, 'src/components');
    config.resolve.alias['@/hooks'] = path.resolve(__dirname, 'src/hooks');
    config.resolve.alias['@/lib'] = path.resolve(__dirname, 'src/lib');
    return config;
  },
  // Cache invalidation comment to trigger rebuild. v4
};

export default nextConfig;
