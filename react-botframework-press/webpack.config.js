const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  return {

    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    resolve: {
      modules: [path.join(__dirname, 'src'), 'node_modules'],
      alias: {
        react: path.join(__dirname, 'node_modules', 'react'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            // (devMode
            //   ?{
            //     loader: 'style-loader',
            //   }
            //   :{
            //     loader: MiniCssExtractPlugin.loader,
            //   }),
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]_[local]_[hash:base64:5]',
                  localIdentHashPrefix: 'botframework-press'
                }
              }
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './public/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'bundle.css'
      }),
      new BrowserSyncPlugin(
        {
          proxy: {
            target: 'http://localhost/botframework-plugin/wp-admin'
          },
          files: [
            '**/*.php'
          ],
          cors: true,
          reloadDelay: 0
        }
      )
    ],
  };
}