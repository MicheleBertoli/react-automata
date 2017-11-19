const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './playground/index.js',

  devServer: {
    contentBase: './dist',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },

  plugins: [new HtmlWebpackPlugin()],
}
