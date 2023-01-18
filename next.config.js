/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SITE_NAME: "Image Colors",
    SITE_LOCALE: "pt-br",
    SITE_BASEURL: "https://getcolors-image.netlify.app",
  },
};

module.exports = nextConfig;
