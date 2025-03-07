/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://erp-i9k4.onrender.com",
      },
    ],
  },
};

module.exports = nextConfig;


// next.config.js
module.exports = {
  webpack(config, { isServer }) {
    // This is to handle any custom rules or loaders you might need
    // Example: Adding a rule to ignore HTML files in node_modules
    config.module.rules.push({
      test: /\.html$/,
      loader: 'ignore-loader', // Use 'ignore-loader' to skip HTML files
    });

    return config;
  },
};

