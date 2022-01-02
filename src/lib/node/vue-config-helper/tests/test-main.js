/* globals describe it */
const assert = require('assert')
const path = require('path')

const { getConfig } = require('@bldr/config')

const {
  buildStyleResourcesLoaderConfig
} = require('../dist/style-resources-loader.js')
const { searchForAliases } = require('../dist/webpack-aliases')
const { configureVue } = require('../dist/main.js')

const config = getConfig()

describe('Package “@bldr/vue-config-helper”', function () {
  it('Function “searchAliases()”', function () {
    const aliases = searchForAliases(
      path.join(config.localRepo, 'src', 'vue', 'apps', 'lamp')
    )
    assert.ok(aliases['@bldr/config$'].includes('@bldr/config'))
    assert.ok(aliases.vue$.includes('vue'))
  })

  it('Function “buildStyleResourcesLoaderConfig()”', function () {
    const config = buildStyleResourcesLoaderConfig()
    assert.strictEqual(config.preProcessor, 'scss')
  })

  it('Function “configureVue()” (default export)', function () {
    const vueConfig = configureVue({
      dirname: path.join(config.localRepo, 'src/vue/apps/lamp')
    })
    assert.strictEqual(
      vueConfig.pluginOptions['style-resources-loader'].preProcessor,
      'scss'
    )
    assert.strictEqual(
      vueConfig.pluginOptions['style-resources-loader'].patterns.length,
      2
    )
    assert.strictEqual(
      typeof vueConfig.configureWebpack.resolve.alias.vue$,
      'string'
    )
  })
})
