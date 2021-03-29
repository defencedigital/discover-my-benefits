// Important modules this config uses
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const OfflinePlugin = require('offline-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = require('./webpack.base.babel')({
  // In production, we skip all hot-reloading stuff
  mode: 'production',
  devtool: '',
  entry: [path.join(process.cwd(), 'app/app.js')],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    publicPath: `/${process.env.SERVICE}/`,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: false,
        sourceMap: false,
      }),
    ],
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },

  plugins: [
    new LodashModuleReplacementPlugin(),
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      service: process.env.SERVICE,
      onetrust: process.env.ONETRUST,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),

    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    new OfflinePlugin({
      ServiceWorker: {
        events: true,
        // prefetchRequest: {
        //   credentials: 'same-origin',
        //   minify: false,
        //   mode: 'cors',
        // },
      },
      relativePaths: false,
      publicPath: `/${process.env.SERVICE}`,
      // No need to cache .htaccess. See http://mxs.is/googmp,
      // this is applied before any match in `caches` section
      excludes: ['.htaccess'],
      caches: {
        main: [':rest:'],

        // All chunks marked as `additional`, loaded after main section
        // and do not prevent SW to install. Change to `optional` if
        // do not want them to be preloaded at all (cached only when first loaded)
        additional: ['*.chunk.js'],
      },

      // Removes warning for about `additional` section usage
      safeToUseOptionalCaches: true,

      // AppCache: false,
    }),
    new WebpackPwaManifest({
      filename: `manifest.json`,
      name: 'MOD Discover My Benefits',
      short_name: 'MOD DMB',
      description:
        'This tool helps you find out what benefits and allowances you could be entitled to as a Service person. You’ll be able to check your exact eligibility on some. Speak to your Unit HR to find out exactly what you’re entitled to and how to make a claim.',
      background_color: '#001731',
      theme_color: '#001731',
      inject: true,
      ios: true,
      icons: [
        {
          src: path.resolve('app/images/favicons/android-chrome-512x512.png'),
          sizes: [192, 512],
        },
        {
          src: path.resolve('app/images/favicons/apple-touch-icon-152x152.png'),
          sizes: [57, 60, 72, 76, 114, 120, 144, 152],
          ios: true,
        },
      ],
    }),
    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg|jpg|json|png)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.json$|\.js$|\.css$|\.html$|\.jpg$|\.svg$/,
      minRatio: 0.75,
      deleteOriginalAssets: false,
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
    }),
  ],

  performance: {
    assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.|manifest\.))/.test(assetFilename),
  },
});
