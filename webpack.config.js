const path = require('path'); // Node.js модуль для разрешения путей файлов
const HtmlWebPackPlugin = require('html-webpack-plugin'); // устанавливается через npm install --save-dev html-webpack-plugin html-loader
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // устанавливается через npm install --save-dev mini-css-extract-plugin css-loader

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            // other options can be configured here
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};
