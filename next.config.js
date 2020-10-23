const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const config = require('./config')

module.exports = () => withSass(withCSS({
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
    OAUTH_URL: config.OAUTH_URL
  },
}))
