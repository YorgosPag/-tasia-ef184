/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process***REMOVED***.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process***REMOVED***.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process***REMOVED***.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process***REMOVED***.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process***REMOVED***.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process***REMOVED***.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
      process***REMOVED***.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    NEXT_PUBLIC_LEAD_NOTIFICATION_EMAIL:
      process***REMOVED***.NEXT_PUBLIC_LEAD_NOTIFICATION_EMAIL,
    NEXT_PUBLIC_SENDGRID_FROM_EMAIL:
      process***REMOVED***.NEXT_PUBLIC_SENDGRID_FROM_EMAIL,
    SENDGRID_API_KEY: process***REMOVED***.SENDGRID_API_KEY,
    NEXT_PUBLIC_ALGOLIA_APP_ID: process***REMOVED***.NEXT_PUBLIC_ALGOLIA_APP_ID,
    NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY:
      process***REMOVED***.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY,
    NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY:
      process***REMOVED***.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY,
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME: process***REMOVED***.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process***REMOVED***.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
