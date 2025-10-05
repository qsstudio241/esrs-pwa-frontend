const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Imposta la directory src a frontend/src
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        src: path.resolve(__dirname, "frontend/src"),
      };

      // Modifica entry point per puntare a frontend/src/index.js
      webpackConfig.entry = path.resolve(__dirname, "frontend/src/index.js");

      return webpackConfig;
    },
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      return middlewares;
    },
  },
};
