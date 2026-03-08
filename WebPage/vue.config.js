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
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|jpg|JPG)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[hash:8][ext]'
          }
        }
      ]
    }
  }
});
