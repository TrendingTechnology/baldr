const os = require('os')
const path = require('path')

const { DefinePlugin } = require('webpack')

const { gitHead } = require('@bldr/core-node')

const { getConfig } = require('@bldr/config')
const config = getConfig()

const themePath = path.dirname(require.resolve('@bldr/themes'))

// https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
// https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
module.exports = {
  chainWebpack: config => {
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    resolve: {
      alias: {
        $HOME: os.homedir()
      }
    },
    plugins: [
      new DefinePlugin({
        // https://webpack.js.org/plugins/define-plugin/
        // If the value is a string it will be used as a code fragment.
        compilationTime: new Date().getTime(),
        config: JSON.stringify(config),
        gitHead: JSON.stringify(gitHead())
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/seating-plan/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.join(themePath, 'default.scss')]
    },
    electronBuilder: {
      builderOptions: {
        appId: 'rocks.friedrich.baldr',
        productName: 'baldr-seating-plan',
        asar: true,
        linux: {
          target: 'deb',
          category: 'Education',
          executableName: 'baldr-seating-plan',
          icon: './icon.svg'
        },
        extraMetadata: {
          name: 'baldr-seating-plan'
        }
      }
    }
  }
}
