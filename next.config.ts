import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack instead of Turbopack to avoid ChunkLoadError

  // Experimental features for better chunk handling
  experimental: {
    optimizePackageImports: ['@tabler/icons-react', '@radix-ui/react-slider', '@radix-ui/react-switch'],
  },
  // Ensure proper chunk loading
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
