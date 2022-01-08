const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')

const { configureVue } = require('@bldr/vue-config-helper-cjs')
const config = require('@bldr/config-cjs')

module.exports = configureVue({
  dirname: __dirname,
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
