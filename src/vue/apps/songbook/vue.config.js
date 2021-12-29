const os = require('os')
const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')

// Project packages.
const { gitHead } = require('@bldr/core-node')

const { getConfig } = require('@bldr/config')
const config = getConfig()

const themePath = path.dirname(require.resolve('@bldr/themes'))

module.exports = {
  chainWebpack: config => {
    // https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
    // https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        $HOME: os.homedir()
      }
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: config.songbook.path,
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
        config: JSON.stringify(config),
        gitHead: JSON.stringify(gitHead()),
        songsJson: JSON.stringify(
          require(path.join(config.songbook.path, 'songs.json'))
        )
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/songbook/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.join(themePath, 'default.scss')]
    },
    electronBuilder: {
      builderOptions: {
        appId: 'rocks.friedrich.baldr',
        productName: 'baldr-songbook',
        asar: true,
        linux: {
          target: 'deb',
          category: 'Education',
          executableName: 'baldr-songbook',
          icon: './icon.svg'
        },
        extraMetadata: {
          name: 'baldr-songbook'
        }
      }
    }
  }
}
