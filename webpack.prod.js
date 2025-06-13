const {merge} = require('webpack-merge');
const common = require("./webpack.common");
const path = require('path');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {InjectManifest} = require("workbox-webpack-plugin");


module.exports = merge(common,{
    mode: "production",
    module:{
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        },
      ],
    },
    plugins: [
        new CleanWebpackPlugin(), 
        new MiniCssExtractPlugin(),
        new InjectManifest({
          swSrc: path.resolve(__dirname, './script/sw.js'),
          swDest: 'sw.bundle.js',
        })
    ],
})