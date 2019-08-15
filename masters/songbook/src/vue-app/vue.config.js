const os = require('os')

const CopyPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')
const git = require('git-rev-sync')

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
      new CopyPlugin([{
        from: '/home/jf/.local/share/baldr/projector',
        to: 'songs',
        ignore: ['.git/**']
      }]),
      new DefinePlugin({
        // https://webpack.js.org/plugins/define-plugin/
        // If the value is a string it will be used as a code fragment.
        'gitRevision': JSON.stringify(git.short()),
        'compilationTime': new Date().getTime()
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/songbook/' : '/'
}
