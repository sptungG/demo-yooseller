/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compress: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  experimental: {
    outputStandalone: true,
  },
  i18n: {
    locales: ["en", "vi", "ko"],
    defaultLocale: "vi",
    localeDetection: false,
  },
  env: {
    apiKey: process.env.NEXT_PUBLIC_apiKey,
    authDomain: process.env.NEXT_PUBLIC_authDomain,
    projectId: process.env.NEXT_PUBLIC_projectId,
    storageBucket: process.env.NEXT_PUBLIC_storageBucket,
    messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
    appId: process.env.NEXT_PUBLIC_appId,
    measurementId: process.env.NEXT_PUBLIC_measurementId,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            // https://react-svgr.com/docs/options/
            icon: true,
            dimensions: false,
            svgo: true,
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
