const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
const Dotenv = require('dotenv-webpack');
const path = require('path');


const config = {
  entry: './client/js/index.js',
  output: {
    filename: '[name].js',
    publicPath: '/client/dist/',
    chunkFilename: '[name].bundle.js',
    path: `${__dirname}/client/dist`,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: [
          path.resolve(__dirname, "client/js"),
          path.resolve(__dirname, "client/templates"),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, "client/styles"),
          path.resolve(__dirname, "client/templates"),
        ],
        use: [
          'style-loader',
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                autoprefixer(),
              ],
            },
          },
          'sass-loader',
        ]
      },
      {
        test: /\.vue$/,
        include: [
          path.resolve(__dirname, "client/js"),
          path.resolve(__dirname, "client/templates"),
        ],
        loader: 'vue-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // Use the full build
    }
  },
  watch: false,
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv(),
    new VueLoaderPlugin()
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  }
};

module.exports = config;