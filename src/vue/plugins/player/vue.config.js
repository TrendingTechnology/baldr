const { getConfig } = require('@bldr/config')
const { DefinePlugin } = require('webpack')

const config = getConfig()

module.exports = {
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        config: JSON.stringify(config),
      })
    ],
    entry: {
      app: './src/app.ts'
    }
  }
}
