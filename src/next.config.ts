import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The development environment uses a proxy, so we need to allow requests
  // from its domains to avoid cross-origin errors.
  devIndicators: {
    allowedDevOrigins: [
      '*.cluster-jbb3mjctu5cbgsi6hwq6u4btwe.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
