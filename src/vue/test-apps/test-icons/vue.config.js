const { assembleVueConfigs } = require('@bldr/vue-config-helper')

module.exports = assembleVueConfigs({
  dirname: __dirname,
  appEntry: './src/app.ts'
})
