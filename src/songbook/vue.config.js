// Node packages.
const os = require('os')
const path = require('path')

// Third party packages.
const CopyPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')

// Project packages.
const core = require('@bldr/core-node')

const config = core.bootstrapConfig()

const themePath = path.dirname(require.resolve('@bldr/themes'))

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
      new CopyPlugin({
        patterns: [
          {
            from: config.songbook.projectorPath,
            to: 'songs',
            globOptions: {
              ignore: ['.git/**']
            }
          }
        ]
      }),
      new DefinePlugin({
        // https://webpack.js.org/plugins/define-plugin/
        // If the value is a string it will be used as a code fragment.
        compilationTime: new Date().getTime(),
        config: JSON.stringify(core.bootstrapConfig()),
        gitHead: JSON.stringify(core.gitHead()),
        songsJson: JSON.stringify(require(path.join(config.songbook.projectorPath, 'songs.json')))
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/songbook/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.join(themePath, 'default.scss')
      ]
    }
  }
}
