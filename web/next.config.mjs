/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    externalDir: true
  },
  transpilePackages: ["@editor/core", "editor"]
};

export default config;
