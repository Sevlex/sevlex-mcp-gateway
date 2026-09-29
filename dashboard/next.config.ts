import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We must tell Next.js not to try and bundle the C++ database driver
  serverExternalPackages: ["better-sqlite3"]
};

export default nextConfig;
