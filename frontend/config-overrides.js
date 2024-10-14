module.exports = function override(config, webpackEnv) {
  config.optimization.splitChunks =
    webpackEnv === 'development'
      ? undefined
      : {
          chunks: 'all',
        };

  return config;
};
