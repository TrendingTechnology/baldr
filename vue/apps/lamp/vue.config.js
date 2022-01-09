const { readMasterExamples, configureVue } = require('@bldr/vue-config-helper-cjs')

const packageJson = require('./package.json')

module.exports = configureVue({
  dirname: __dirname,
  additionalDefinitions: {
    lampVersion: packageJson.version,
    rawYamlExamples: readMasterExamples()
  },
  electronAppName: 'lamp',
  analyzeBundle: false
})
