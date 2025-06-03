const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const { error } = require("console");
const { cli } = require("webpack");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
});