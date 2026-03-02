/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    domains: [
      "wedsy.s3.amazonaws.com",
      "wedsy.s3.ap-south-1.amazonaws.com",
      "wedsy-images-prod.s3.amazonaws.com",
      "wedsy-images-prod.s3.ap-south-1.amazonaws.com"
    ],
  },
};

module.exports = nextConfig;
