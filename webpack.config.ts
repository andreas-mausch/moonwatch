import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import { name, tizenPackage, version } from './package.json';

const htmlWebpack = new HtmlWebpackPlugin({
  template: 'index.html',
  inject: 'body'
});

const copyFiles = new CopyWebpackPlugin({
  patterns: [
    {from: 'icon.png'},
    {from: 'assets', to: 'assets'}
  ]
});

const config: webpack.Configuration = {
  entry: ['./source/app.ts'],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.min.js'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      {test: /\.tsx?$/, loader: 'ts-loader', exclude: '/node-modules'},
      {test: /config\.xml$/, use: [
        {loader: 'file-loader?name=config.xml'},
        {
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: /\$NAME/g, replace: name },
              { search: /\$PACKAGE/g, replace: tizenPackage },
              { search: /\$VERSION/g, replace: version }
            ]
          }
        }
      ]},
      {
        test: /\.s[ac]ss$/i, use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|svg)$/, use: [
          {loader: 'file-loader?name=[path]/[name].[ext]'}
        ]
      }
    ]
  },

  plugins: [
    copyFiles, htmlWebpack
  ],

  optimization: {
    minimizer: [new UglifyJsPlugin()],
  }
};

export default config;
