/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async rewrites() {
    const judge0Url = process.env.JUDGE0_API_URL || 'https://judge0.devfellowship.com';
    return [
      {
        source: '/api/judge0/:path*',
        destination: `${judge0Url}/:path*`,
      },
    ]
  },
}

export default nextConfig