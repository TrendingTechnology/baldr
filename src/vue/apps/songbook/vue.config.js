// Node packages.
const os = require('os')
const path = require('path')

// Third party packages.
const CopyPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')

// Project packages.
const { utils } = require('@bldr/core')

const config = utils.bootstrapConfig()

const themePath = path.dirname(require.resolve('@bldr/theme-default'))

module.exports = {
  chainWebpack: (config) => {
    // https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
    // https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    resolve: {
      alias: {
        $HOME: os.homedir()
      }
    },
    plugins: [
      new CopyPlugin([{
        from: config.songbook.projectorPath,
        to: 'songs',
        ignore: ['.git/**']
      }]),
      new DefinePlugin({
        // https://webpack.js.org/plugins/define-plugin/
        // If the value is a string it will be used as a code fragment.
        compilationTime: new Date().getTime(),
        config: JSON.stringify(utils.bootstrapConfig()),
        gitHead: JSON.stringify(utils.gitHead()),
        songsJson: JSON.stringify(require(path.join(config.songbook.projectorPath, 'songs.json')))
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/songbook/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.join(themePath, 'styles.scss')
      ]
    }
  }
}
