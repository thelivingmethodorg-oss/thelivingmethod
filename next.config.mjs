/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // cms-renderer 2.0.0 bundles a Markdown WASM loader Turbopack cannot follow;
  // Node loads the package as-is instead. Remove once on cms-renderer >= 2.0.1.
  serverExternalPackages: ["cms-renderer"],
};

export default nextConfig;
