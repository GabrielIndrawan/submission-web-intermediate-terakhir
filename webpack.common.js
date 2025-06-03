const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./script/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      excludeChunks: ['sw'],
    }),
    new CopyWebpackPlugin({patterns: [
        {
          from: path.resolve(__dirname, './public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    })
  ],
};
