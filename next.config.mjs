import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.js",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // This explicitly allows your Codespace preview to connect
  allowedDevOrigins: ['127.0.0.1', '10.0.2.54', 'localhost'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(wav|mp3|ogg|mp4)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/sounds/',
            outputPath: 'static/sounds/',
            name: '[name].[ext]',
            esModule: false,
          },
        },
      ],
    });

    return config;
  },
};

export default withSerwist(nextConfig);
