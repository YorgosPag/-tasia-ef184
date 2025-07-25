/** @type {import('next').NextConfig} */
import nextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process***REMOVED***.ANALYZE === 'true',
});

// Detect current domain context (e.g., "nestor" or "tasia")
const PROJECT = process***REMOVED***.PROJECT || 'tasia';

const nextConfig = {
  // Optional: Conditional redirect based on domain
  async redirects() {
    return [
      {
        source: '/',
        destination: PROJECT === 'nestor' ? '/nestor/projects' : '/projects',
        permanent: true,
      },
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

  // Optional: Add more project-specific config below if needed
};

export default withBundleAnalyzer(nextConfig);
