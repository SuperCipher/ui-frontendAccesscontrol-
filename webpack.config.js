const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : false,
  entry: {
    ui: "./config/ui-entry.js",
    uiremote: "./config/uiremote.js",
    uidelete: "./config/uidelete-entry.js",
    listedit:"./config/listedit.js",
    vendors: ["jquery","alertifyjs","socket.io-client"],
  },
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: "[name].bundle.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CommonsChunkPlugin({
      name: 'vendors',
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader", // translates CSS into CommonJS
          options: {
            includePaths: [path.resolve(__dirname, 'node_modules')],
          },
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]

      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }

    ]

  }
};
