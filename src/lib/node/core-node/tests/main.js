/* globals describe it */
const assert = require('assert')
const path = require('path')

const { findParentFile } = require('../dist/node/main.js')
const config = require('@bldr/config')

describe('Package “@bldr/core-node”', function () {
  it('findParentFile', function () {
    findParentFile
    const testFile = path.join(
      config.mediaServer.basePath,
      'musik/05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'
    )

    console.log(findParentFile(testFile, 'title.txt'))
  })
})
