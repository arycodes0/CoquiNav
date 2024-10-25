const path = require('path');

module.exports = {
    mode: 'development',
  // Single entry point for your application
  entry: './static/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  target: 'web',
  // Optional source map for debugging
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  // Development server configuration (optional)
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 5000,
  },
};