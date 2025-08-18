/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    externalDir: true
  },
  transpilePackages: ["@editor/core"]
};

export default config;
