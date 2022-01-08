const { readMasterExamples, configureVue } = require('@bldr/vue-config-helper-cjs')

// const { exportSassAsJson } = require('@bldr/themes')
const packageJson = require('./package.json')

module.exports = configureVue({
  dirname: __dirname,
  additionalDefinitions: {
    defaultThemeSassVars: {},
    lampVersion: packageJson.version,
    rawYamlExamples: readMasterExamples()
  },
  electronAppName: 'lamp',
  analyzeBundle: false
})
