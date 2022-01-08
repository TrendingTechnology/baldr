const { configureVue } = require('@bldr/vue-config-helper-cjs')

module.exports = configureVue({
  dirname: __dirname,
  appEntry: './src/app.ts'
})
