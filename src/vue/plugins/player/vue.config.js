const path = require('path')
const { DefinePlugin } = require('webpack')

const { createAliases } = require('@bldr/vue-config-helper')
const { getConfig } = require('@bldr/config')

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
    resolve: {
      alias: createAliases(['vue'], __dirname)
    },
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
