module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      Object.assign(config, {
        target: 'electron-renderer',
      });
    }
    return config;
  },
};
