/* globals describe it */
const assert = require('assert')
const path = require('path')

const {
  searchForAliases,
  buildStyleResourcesLoaderConfig,
  assembleVueConfigs
} = require('../dist/main.js')

const { getConfig } = require('@bldr/config')

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
    assert.strictEqual(config['style-resources-loader'].preProcessor, 'scss')
  })

  it('Function “assembleVueConfigs()”', function () {
    const vueConfig = assembleVueConfigs({ dirname: path.join(config.localRepo, 'src/vue/apps/lamp') })
    assert.strictEqual(vueConfig.pluginOptions['style-resources-loader'].preProcessor, 'scss')
    assert.strictEqual(vueConfig.pluginOptions['style-resources-loader'].patterns.length, 2)
    assert.strictEqual(typeof vueConfig.configureWebpack.resolve.alias.vue$, 'string')
  })
})
