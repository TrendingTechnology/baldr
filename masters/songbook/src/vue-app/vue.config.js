const os = require('os')

const CopyPlugin = require('copy-webpack-plugin')

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
      }])
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/songbook/' : '/'
}
