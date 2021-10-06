/* globals describe it */
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const {
  findParentFile,
  getBasename,
  createTmpDir
} = require('../dist/node/main.js')
const config = require('@bldr/config')

describe('Package “@bldr/core-node”', function () {
  it('function  “findParentFile()”', function () {
    const testFile = path.join(
      config.mediaServer.basePath,
      'Musik/05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'
    )
    assert.strictEqual(
      findParentFile(testFile, 'title.txt'),
      path.join(
        config.mediaServer.basePath,
        'Musik/05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/title.txt'
      )
    )
  })

  it('function  “getBasename()”', function () {
    assert.strictEqual(
      getBasename('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'),
      'Arbeitsblatt'
    )
  })

  it('function  “createTmpDir()”', function () {
    const dir = createTmpDir()
    const stat = fs.statSync(dir)
    assert.ok(stat.isDirectory())
  })
})
