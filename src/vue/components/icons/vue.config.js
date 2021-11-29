// Node packages.
const path = require('path')

function stylePath (themeName) {
  return path.join(
    path.dirname(require.resolve('@bldr/themes')),
    `${themeName}.scss`
  )
}

// https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
// https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
module.exports = {
  chainWebpack: config => {
    config.resolve.symlinks(false)
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [stylePath('default'), stylePath('handwriting')]
    },
  },
  configureWebpack: {
    entry: {
      app: './src/app.ts'
    }
  }
}
