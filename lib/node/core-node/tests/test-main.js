/* globals describe it */
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const {
  findParentFile,
  getBasename,
  getTmpDirPath,
  createTmpDir,
  copyToTmp
} = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config')
const config = getConfig()

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

  it('Function “getBasename()”', function () {
    assert.strictEqual(
      getBasename('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'),
      'Arbeitsblatt'
    )
  })

  it('Function “getTmpDirPath()”', function () {
    assert.ok(getTmpDirPath().includes('baldr'))
  })

  it('Function “createTmpDir()”', function () {
    const dir = createTmpDir()
    const stat = fs.statSync(dir)
    assert.ok(stat.isDirectory())
  })

  it('Function “copyToTmp()”', function () {
    const dest = copyToTmp(__dirname, '..', 'package.json')
    const stat = fs.statSync(dest)
    assert.ok(fs.existsSync(dest))
    assert.ok(stat.isFile())
  })
})
