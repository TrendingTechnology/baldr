const { configureVue } = require('@bldr/vue-config-helper')

module.exports = configureVue({
  dirname: new URL('.', import.meta.url).pathname,
  appEntry: './src/app.ts'
})
