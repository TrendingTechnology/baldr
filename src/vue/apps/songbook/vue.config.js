const os = require('os')
const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')

const {
  buildStyleResourcesLoaderConfig,
  buildDefinePluginConfig,
  searchForAliases
} = require('@bldr/vue-config-helper')
const { getConfig } = require('@bldr/config')

const config = getConfig()

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
        $HOME: os.homedir(),
        ...searchForAliases(__dirname)
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
      buildDefinePluginConfig({
        songsJson: require(path.join(config.songbook.path, 'songs.json'))
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/songbook/' : '/',
  pluginOptions: {
    ...buildStyleResourcesLoaderConfig(),
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
