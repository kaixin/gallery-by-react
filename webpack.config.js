//webpack.config.js
const path =require('path');
module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test:  /\.js$/, 
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["es2015","react"] 
        }
      },
      {
          test: /\.json$/,
          loader: 'json-loader'
      },
      {
          test: /\.(png|jpg|woff|woff2|eof|ttf|svg)$/,
          loader: 'url-loader'
      }
    ]
  }
};