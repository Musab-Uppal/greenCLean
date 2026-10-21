/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker / Dokploy deployment
  // Traces only the files needed to run the app → lean production image
  output: "standalone",
};

export default nextConfig;
