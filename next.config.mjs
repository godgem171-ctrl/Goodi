/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: [
      's4.anilist.co',
      "i.ytimg.com",
      'artworks.thetvdb.com',
      'media.kitsu.io',
      'media.kitsu.app',
      'kitsu-production-media.s3.us-west-002.backblazeb2.com',
      'media.themoviedb.org'
    ],
    unoptimized: true
  },
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    RABBIT_API_KEY: process.env.RABBIT_API_KEY,
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  },

};

export default nextConfig;
