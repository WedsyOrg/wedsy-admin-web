/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["wedsy.s3.amazonaws.com", "wedsy.s3.ap-south-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
