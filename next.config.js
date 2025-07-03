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
        destination: '/pages/student/dashboard/:path*',
      },
      {
        source: '/projects/:path*',
        destination: '/pages/project/dashboard/:path*',
      },
      {
        source: '/equipments/:path*',
        destination: '/pages/equipment/dashboard/:path*',
      },
      {
        source: '/admins/:path*',
        destination: '/pages/admin/dashboard/:path*',
      },
      {
        source: '/staff/:path*',
        destination: '/pages/staff/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
