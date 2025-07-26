/** @type {import('next').NextConfig} */
import nextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process***REMOVED***.ANALYZE === 'true',
});

const nextConfig = {
  async rewrites() {
    return [
      // Rewrites for Tasia App
      {
        source: '/attachments',
        destination: '/tasia/attachments',
      },
      {
        source: '/buildings/:id',
        destination: '/tasia/buildings/:id',
      },
      {
        source: '/contacts',
        destination: '/tasia/contacts',
      },
      {
        source: '/floors/:id',
        destination: '/tasia/floors/:id',
      },
      {
        source: '/projects',
        destination: '/tasia/projects',
      },
       {
        source: '/projects/:id',
        destination: '/tasia/projects/:id',
      },
      {
        source: '/units',
        destination: '/tasia/units',
      },
      {
        source: '/units/:id',
        destination: '/tasia/units/:id',
      },
      // You can add more rewrites for other Tasia pages here
    ];
  },
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
};

export default withBundleAnalyzer(nextConfig);
