const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  serverActions: {
    bodySizeLimit: "5mb",
  },
};

export default nextConfig;
