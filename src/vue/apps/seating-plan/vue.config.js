const os = require('os')

const {
  buildStyleResourcesLoaderConfig,
  buildDefinePluginConfig,
  searchForAliases
} = require('@bldr/vue-config-helper')

// https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
// https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
module.exports = {
  chainWebpack: config => {
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    resolve: {
      alias: {
        $HOME: os.homedir(),
        ...searchForAliases(__dirname)
      }
    },
    plugins: [
      buildDefinePluginConfig()
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/seating-plan/' : '/',
  pluginOptions: {
    ...buildStyleResourcesLoaderConfig(),
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
