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
        destination: 'http://143.110.200.45:2358/:path*',
      },
    ]
  },
}

export default nextConfig