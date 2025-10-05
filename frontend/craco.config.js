const path = require("path");

module.exports = {
  babel: {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current",
          },
        },
      ],
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
        },
      ],
    ],
  },
  webpack: {
    configure: (webpackConfig) => {
      // Assicuriamoci che webpack usi la directory src corretta
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
