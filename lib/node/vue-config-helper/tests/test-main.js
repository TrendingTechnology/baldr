/* globals describe it */
import assert from 'assert'
import path from 'path'

import { getConfig } from '@bldr/config'

import { buildStyleResourcesLoaderConfig } from '../dist/style-resources-loader.js'
import { searchForAliases } from '../dist/webpack-aliases.js'
import { configureVue } from '../dist/main.js'

const config = getConfig()

describe('Package “@bldr/vue-config-helper”', function () {
  it('Function “searchAliases()”', function () {
    const aliases = searchForAliases(
      path.join(config.localRepo, 'vue', 'apps', 'lamp')
    )
    assert.ok(aliases['@bldr/config$'].includes('@bldr/config'))
    assert.ok(aliases.vue$.includes('vue'))
  })

  it('Function “buildStyleResourcesLoaderConfig()”', function () {
    const config = buildStyleResourcesLoaderConfig()
    assert.strictEqual(config.preProcessor, 'scss')
  })

  describe('Function “configureVue()”', function () {
    const dirname = path.join(config.localRepo, 'vue/apps/lamp')
    describe('Minimal config', function () {
      const minimal = configureVue({
        dirname
      })

      describe("pluginOptions['style-resources-loader']", function () {
        it('preProcessor', function () {
          assert.strictEqual(
            minimal.pluginOptions['style-resources-loader'].preProcessor,
            'scss'
          )
        })

        it('patterns', function () {
          assert.strictEqual(
            minimal.pluginOptions['style-resources-loader'].patterns.length,
            2
          )
        })
      })

      it('configureWebpack.resolve.alias', function () {
        assert.strictEqual(
          typeof minimal.configureWebpack.resolve.alias.vue$,
          'string'
        )
      })
    })

    it('analyzeBundle', function () {
      const vconf = configureVue({
        dirname,
        analyzeBundle: true
      })
      assert.strictEqual(typeof vconf.configureWebpack.plugins[1], 'object')
    })
  })
})
