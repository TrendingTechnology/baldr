const { DefinePlugin } = require('webpack')

const { createAliases, getStylePaths } = require('@bldr/vue-config-helper')
const { getConfig } = require('@bldr/config')

const config = getConfig()

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: getStylePaths()
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
