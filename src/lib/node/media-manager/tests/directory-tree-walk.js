/* globals describe it */
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const { walk } = require('../dist/node/directory-tree-walk')
const config = require('@bldr/config')

function getPath (relPath) {
  return path.join(config.mediaServer.basePath, relPath)
}

describe('Package “@bldr/media-manager”: directory-walk', function () {
  it('Function “walk()”', async function () {
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
      results.presentation.length + results.asset.length + results.tex.length <=
        results.all.length
    )
  })
})
