/* globals describe it */
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const { walk } = require('../dist/node/directory-tree-walk')
const { getConfig } = require('@bldr/config-ng')
const config = getConfig()

function getPath (relPath) {
  return path.join(config.mediaServer.basePath, relPath)
}

describe('Package “@bldr/media-manager”: directory-walk', function () {
  describe('Function “walk()”', function () {
    it('Called with a function bundle', async function () {
      const results = {
        presentation: [],
        asset: [],
        tex: [],
        all: []
      }
      await walk(
        {
          presentation (filePath) {
            results.presentation.push(filePath)
            assert.ok(
              filePath.match(/.*Praesentation.baldr.yml$/) != null,
              filePath
            )
            assert.ok(fs.existsSync(filePath), filePath)
          },
          asset (filePath) {
            results.asset.push(filePath)
            assert.ok(fs.existsSync(filePath), filePath)
          },
          tex (filePath) {
            results.tex.push(filePath)
            assert.ok(filePath.match(/.*tex$/) != null, filePath)
            assert.ok(fs.existsSync(filePath), filePath)
          },
          all (filePath) {
            results.all.push(filePath)
            assert.ok(fs.existsSync(filePath), filePath)
          }
        },
        { path: getPath('Musik/05') }
      )
      assert.ok(
        results.presentation.length +
          results.asset.length +
          results.tex.length <=
          results.all.length
      )
    })

    it('Called with a single function', async function () {
      await walk(
        (filePath, payload) => {
          const stat = fs.statSync(filePath)
          assert.ok(stat.isFile())
          assert.strictEqual(payload.test, 'Test')
        },
        { path: getPath('Musik/05'), payload: { test: 'Test' } }
      )
    })

    it('options.regex', async function () {
      await walk(
        (filePath) => {
          assert.ok(filePath.match(/.*\.yml$/i) != null)
        },
        { path: getPath('Musik/05'), regex: /.*\.yml$/i }
      )
    })
  })
})
