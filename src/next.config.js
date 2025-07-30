
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
  // Cache invalidation comment to trigger rebuild. v4
};

export default nextConfig;
