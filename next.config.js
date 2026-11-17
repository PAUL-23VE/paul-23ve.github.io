/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exporta el sitio como HTML estático en /out para publicarlo en GitHub Pages.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
