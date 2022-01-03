const { readMasterExamples, configureVue } = require('@bldr/vue-config-helper')

const { exportSassAsJson } = require('@bldr/themes')
const packageJson = require('./package.json')

module.exports = configureVue({
  dirname: __dirname,
  additionalDefinitions: {
    defaultThemeSassVars: exportSassAsJson(),
    lampVersion: packageJson.version,
    rawYamlExamples: readMasterExamples()
  },
  electronAppName: 'lamp',
  analyzeBundle: true
})
