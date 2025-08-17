/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'standalone' to allow proper static generation
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'freeimage.host',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Add proper headers for API routes and Farcaster manifest
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
      {
        source: '/.well-known/farcaster.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ];
  },
  async redirects() {
    const hostedId = process.env.NEXT_PUBLIC_HOSTED_MANIFEST_ID;
    if (hostedId) {
      return [
        {
          source: '/.well-known/farcaster.json',
          destination: `https://api.farcaster.xyz/miniapps/hosted-manifest/${hostedId}`,
          permanent: false,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig; 