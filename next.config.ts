/** @type {import('next').NextConfig} */
const nextConfig = {
    // CDN Configuration
    // If NEXT_PUBLIC_CDN_URL is defined, use it as the asset prefix
    // Example: https://cdn.example.com
    assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
        ],
    },
};

export default nextConfig;
