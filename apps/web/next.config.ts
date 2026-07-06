import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@prompthub/database', '@prompthub/shared', '@prompthub/stripe'],
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },
  turbopack: {
      root: '../../',
  },
};

export default nextConfig;
