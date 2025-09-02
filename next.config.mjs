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
  },

  async rewrites() {
    return [
      {
        source: '/api/judge0/:path*',
        destination: process.env.JUDGE0_API_URL || 'http://localhost:2358/:path*',
      },
    ]
  },
}

export default nextConfig