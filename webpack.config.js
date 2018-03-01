'use strict';
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const buildConfig = require('./config/build.config.json');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const nodeModules = fs.readdirSync('node_modules').filter(x => {
  return ['.bin'].indexOf(x) === -1;
});
module.exports = {
  entry: {
    app: './src/main.ts',
  },
  target: 'node',
  context: __dirname, // to automatically find tsconfig.json
  devtool: 'inline-source-map',
  mode: 'development',
  node: {
    __dirname: true,
    __filename: true,
  },
  output: {
    path: path.join(__dirname, buildConfig.outDir),
    filename: 'app.bundle.js',
  },
  externals: [
    function(context, request, callback) {
      const pathStart = request.split('/')[0];
      if (nodeModules.indexOf(pathStart) >= 0 && request != 'webpack/hot/signal.js') {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: 4,
              workerParallelJobs: 50,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', 'js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      workers: ForkTsCheckerWebpackPlugin.ONE_CPU_FREE,
      watch: ['./src/**/*.ts'],
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.SourceMapDevToolPlugin({
      test: /\.ts$/i,
    }),
    new WebpackShellPlugin({
      onBuildEnd: ['npm run start:dev'],
    }),
  ],
  stats: {
    // Sort assets by a field
    // You can reverse the sort with `!field`.
    assetsSort: 'field',
    // Add information about cached (not built) modules
    cached: true,
    // Add children information
    children: false,
    // Add chunk information (setting this to `false` allows for a less verbose output)
    chunks: false,
    // Add built modules information to chunk information
    chunkModules: false,
    // Add the origins of chunks and chunk merging info
    chunkOrigins: false,
    // Sort the chunks by a field
    // You can reverse the sort with `!field`. Default is `id`.
    chunksSort: 'field',
    // `webpack --colors` equivalent
    colors: true,
    // Display the distance from the entry point for each module
    depth: false,
    // Display the entry points with the corresponding bundles
    entrypoints: false,
    // Add --env information
    env: false,
    // Add errors
    errors: true,
    // Add details to errors (like resolving log)
    errorDetails: true,
    hash: true,
    // Set the maximum number of modules to be shown
    maxModules: 5,
    // Add built modules information
    modules: true,
    // Sort the modules by a field
    // You can reverse the sort with `!field`. Default is `id`.
    modulesSort: 'field',
    // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
    moduleTrace: true,
    // Show the exports of the modules
    providedExports: false,
    // Add public path information
    publicPath: false,
    // Add information about the reasons why modules are included
    reasons: true,
    // Add timing information
    timings: true,
    // Show which exports of a module are used
    usedExports: false,
    // Add webpack version information
    version: true,
    // Add warnings
    warnings: true,
  },
};
