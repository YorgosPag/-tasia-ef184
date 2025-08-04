// This file is empty, but it's required for the app to run.
// Future Next.js configuration can be added here.
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/design-system',
                permanent: true,
            },
            {
                source: '/project-management',
                destination: '/projects',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
