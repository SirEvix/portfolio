const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src') // Ensure the alias '@' points to the 'src' directory
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_OPTIONS_API__': true,
        '__VUE_PROD_DEVTOOLS__': false,
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false
      })
    ]
  },
  chainWebpack(config) {
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg|jpg|JPG)$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/images/[name].[hash:8].[ext]', // Ensure the output path is correct
      });
  }
});
