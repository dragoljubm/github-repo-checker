const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: `${__dirname}/src/popup/index.js`,
    options: `${__dirname}/src/options/index.js`,
    background: `${__dirname}/src/background/background.js`,
  },
  module: {
    rules: [{ test: /\.jsx?$/, use: "babel-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/manifest.json", to: "../" },
        { from: "./src/icon.png", to: "../" },
        { from: "./src/options.svg", to: "../" },
        {
          from: "./src/options/index.html",
          to: `../options/index.html`,
        },
        {
          from: "./src/popup/index.html",
          to: `../popup/index.html`,
        },
        {
          from: "./src/popup/style.css",
          to: `../popup/style.css`,
        },
        {
          from: "./src/options/style.css",
          to: `../options/style.css`,
        },
      ],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: `${__dirname}/dist/bundles`,
    clean: true,
  },
};
