import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native/WASM packages must stay external so Turbopack does not bundle them.
  serverExternalPackages: ["@electric-sql/pglite", "@node-rs/argon2"],
};

export default nextConfig;
