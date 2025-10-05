const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Assicuriamoci che webpack usi la directory src corretta (frontend/src)
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, "src"),
        "node_modules",
      ];

      return webpackConfig;
    },
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      return middlewares;
    },
  },
};
