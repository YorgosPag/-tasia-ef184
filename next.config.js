/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirect / to /tasia/dashboard
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tasia/dashboard',
        permanent: true,
      },
       {
        source: '/dashboard',
        destination: '/tasia/dashboard',
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
};

export default nextConfig;
