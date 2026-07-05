import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allow the local Playwright/QA harness to hit the dev server via 127.0.0.1
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
