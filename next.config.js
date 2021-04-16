module.exports = {
  webpack: (config, { isServer }) => {
    // Note: This is required to use the Zora ZDK on the client
    if (!isServer) config.node = { fs: 'empty' };
    return config;
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: `${process.env.NODE_ENV === 'development' ? '*' : process.env.ACCESS_ORIGIN}` },
        ]
      }
    ]
  }
};