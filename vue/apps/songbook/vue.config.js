const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')

const { configureVue } = require('@bldr/vue-config-helper')
const { getConfig } = require('@bldr/config')

const config = getConfig()

module.exports = configureVue({
  dirname: new URL('.', import.meta.url).pathname,
  additionalDefinitions: {
    songsJson: require(path.join(config.songbook.path, 'songs.json'))
  },
  electronAppName: 'songbook',
  analyzeBundle: false,
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
    })
  ]
})
