// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        // Optionally ignore AWS-related modules if they are only used on the server:
        'aws-sdk': false,
        'mock-aws-s3': false,
        nock: false,
      };

      // Handle HTML files, including those in node_modules
      config.module.rules.push({
        test: /\.html$/,
        use: 'null-loader', // Use null-loader to ignore HTML files completely
      });
    }
    return config;
  },
};

export default nextConfig;