import type { NextConfig } from "next";

// Next.js 16 runs the TypeScript type-check during `next build` (it must pass)
// but no longer runs ESLint as part of the build, so lint findings never block
// a Vercel deploy. Run lint manually with `npm run lint`.
const nextConfig: NextConfig = {};

export default nextConfig;
