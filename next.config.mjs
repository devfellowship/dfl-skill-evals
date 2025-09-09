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
        destination: 'http://146.190.150.14:2358/:path*',
      },
    ]
  },
}

export default nextConfig