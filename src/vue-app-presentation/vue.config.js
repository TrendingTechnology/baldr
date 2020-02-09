// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const { DefinePlugin } = require('webpack')

// Project packages
const core = require('@bldr/core-node')
const { exportSassAsJson } = require('@bldr/themes')

function stylePath (themeName) {
  return path.join(path.dirname(require.resolve('@bldr/themes')), `${themeName}.scss`)
}

function readExamples () {
  const exampleFiles = fs.readdirSync('./examples')
  const examples = {}
  for (const exampleFile of exampleFiles) {
    const key = exampleFile.replace('.baldr.yml', '')
    const rawYaml = fs.readFileSync(path.join('examples', exampleFile), 'utf8')
    examples[key] = rawYaml
  }
  return examples
}

// https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
// https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        // https://webpack.js.org/plugins/define-plugin/
        // If the value is a string it will be used as a code fragment.
        compilationTime: new Date().getTime(),
        config: JSON.stringify(core.bootstrapConfig()),
        defaultThemeSassVars: JSON.stringify(exportSassAsJson()),
        gitHead: JSON.stringify(core.gitHead()),
        rawYamlExamples: JSON.stringify(readExamples())
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/presentation/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        stylePath('default'),
        stylePath('handwriting')
      ]
    }
  }
}
