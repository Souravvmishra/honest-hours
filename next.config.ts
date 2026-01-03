import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Experimental features for better chunk handling and tree-shaking
  experimental: {
    optimizePackageImports: [
      '@tabler/icons-react',
      'date-fns',
      '@radix-ui/react-tabs',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
    ],
  },

  // Ensure proper chunk loading
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default nextConfig;
