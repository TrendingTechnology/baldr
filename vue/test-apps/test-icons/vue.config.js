const { configureVue } = require('@bldr/vue-config-helper')

module.exports = configureVue({
  dirname: __dirname,
  appEntry: './src/app.ts'
})
