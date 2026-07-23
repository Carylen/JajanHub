/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile the workspace packages (shipped as TS source, not pre-built).
  transpilePackages: ['@jajanhub/ui', '@jajanhub/api', '@jajanhub/tokens'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
