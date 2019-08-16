// Node packages.
const path = require('path')

const themePath = path.dirname(require.resolve('@bldr/theme-default'))

module.exports = {
  chainWebpack: (config) => {
    // https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
    // https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
    config.resolve.symlinks(false)
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.join(themePath, 'globals', '_variables.scss'),
      ]
    }
  }
}
