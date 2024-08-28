/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.randomlandia.com',
        port: '',
        pathname: '/ecommerce/**',
      },
    ],
  },
};

export default nextConfig;
