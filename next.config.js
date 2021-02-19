const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const webpack = require('webpack')
// 依赖关系
const config = require('./config')

module.exports = () =>
  withBundleAnalyzer(
    withSass(
      withCSS({
        webpack(config) {
          config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
          return config
        },
        publicRuntimeConfig: {
          GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
          OAUTH_URL: config.OAUTH_URL,
        },
        analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
        bundleAnalyzerConfig: {
          server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html',
          },
          browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html',
          },
        },
      })
    )
  )
