const path = require('path')
const { getConfig } = require('@bldr/config')
const { DefinePlugin } = require('webpack')

function stylePath (themeName) {
  return path.join(
    path.dirname(require.resolve('@bldr/themes')),
    `${themeName}.scss`
  )
}

const config = getConfig()

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [stylePath('default'), stylePath('handwriting')]
    }
  },
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        config: JSON.stringify(config)
      })
    ],
    entry: {
      app: './src/app.ts'
    }
  }
}
