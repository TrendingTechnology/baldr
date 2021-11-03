// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const { DefinePlugin } = require('webpack')

// Project packages
const { gitHead } = require('@bldr/core-node')
const { exportSassAsJson } = require('@bldr/themes')
const packageJson = require('./package.json')
const { getConfig } = require('@bldr/config-ng')
const config = getConfig()

function stylePath (themeName) {
  return path.join(
    path.dirname(require.resolve('@bldr/themes')),
    `${themeName}.scss`
  )
}

function readExamples () {
  const examples = {
    common: {},
    masters: {}
  }
  // common
  for (const exampleFile of fs.readdirSync('./examples')) {
    const key = exampleFile.replace('.baldr.yml', '')
    const rawYaml = fs.readFileSync(path.join('examples', exampleFile), 'utf8')
    examples.common[key] = rawYaml
  }
  // masters
  const mastersBasePath = path.join('src', 'masters')
  for (const masterName of fs.readdirSync(mastersBasePath)) {
    const rawYaml = fs.readFileSync(
      path.join(mastersBasePath, masterName, 'examples.baldr.yml'),
      'utf8'
    )
    examples.masters[masterName] = rawYaml
  }

  return examples
}

// https://forum.vuejs.org/t/vue-cli-does-not-work-with-symlinked-node-modules-using-lerna/61700
// https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
module.exports = {
  chainWebpack: config => {
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        // https://webpack.js.org/plugins/define-plugin/
        // If the value is a string it will be used as a code fragment.
        compilationTime: new Date().getTime(),
        config: JSON.stringify(config),
        defaultThemeSassVars: JSON.stringify(exportSassAsJson()),
        gitHead: JSON.stringify(gitHead()),
        lampVersion: JSON.stringify(packageJson.version),
        rawYamlExamples: JSON.stringify(readExamples())
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/presentation/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [stylePath('default'), stylePath('handwriting')]
    },
    electronBuilder: {
      preload: 'src/preload.js',
      // nodeIntegration: true,
      builderOptions: {
        appId: 'rocks.friedrich.baldr',
        productName: 'baldr-lamp',
        asar: true,
        linux: {
          target: 'deb',
          category: 'Education',
          executableName: 'baldr-lamp',
          icon: './icon.svg'
        },
        extraMetadata: {
          name: 'baldr-lamp'
        }
      }
    }
  }
}
