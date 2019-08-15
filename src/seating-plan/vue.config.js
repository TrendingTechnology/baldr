const os = require('os')
const { DefinePlugin } = require('webpack')
const { utils } = require('@bldr/core')

// https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
// https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
module.exports = {
  chainWebpack: (config) => {
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
        gitHead: JSON.stringify(utils.gitHead())
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/seating-plan/' : '/'
}
