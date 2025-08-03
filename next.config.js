// This file is empty, but it's required for the app to run.
// Future Next.js configuration can be added here.
/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/project-management',
                destination: '/projects',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
