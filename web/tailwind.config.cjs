/** @type {import('tailwindcss').Config} */
const path = require("path");
const fs = require("fs");

const pkgsDir = path.join(__dirname, "..", "packages");
// auto-detect all workspace packages and point Tailwind at their src/
const pkgSrcGlobs = fs
  .readdirSync(pkgsDir)
  .filter((name) => fs.statSync(path.join(pkgsDir, name)).isDirectory())
  .map((name) => path.join(pkgsDir, name, "src/**/*.{ts,tsx}"));

module.exports = {
  content: [
    // your Next.js app dir
    path.join(__dirname, "app/**/*.{ts,tsx}"),
    // all packages' src (no dist, no node_modules)
    ...pkgSrcGlobs,
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
