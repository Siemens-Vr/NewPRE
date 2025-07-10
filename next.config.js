/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "erp-i9k4.onrender.com",
      },
    ],
  },
  webpack(config, { isServer }) {
    // Example: Adding a rule to ignore HTML files in node_modules
    config.module.rules.push({
      test: /\.html$/,
      loader: 'ignore-loader',
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/students/:path*',
        destination: '/student/dashboard/:path*',
      },
      {
        source: '/projects/:path*',
        destination: '/project/dashboard/:path*',
      },
      {
        source: '/equipments/:path*',
        destination: '/equipment/dashboard/:path*',
      },
      {
        source: '/admins/:path*',
        destination: '/admin/dashboard/:path*',
      },
      {
        source: '/staff/:path*',
        destination: '/staff/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
