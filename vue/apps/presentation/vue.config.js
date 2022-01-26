const { readMasterExamples, configureVue } = require('@bldr/vue-config-helper-cjs')

const packageJson = require('./package.json')

module.exports = configureVue({
  dirname: __dirname,
  additionalDefinitions: {
    presentationVersion: packageJson.version,
    rawYamlExamples: readMasterExamples()
  },
  electronAppName: 'presentation',
  analyzeBundle: false
})
