/* globals describe it */
const assert = require('assert')
const path = require('path')
const fs = require('fs')
const { readFile } = require('@bldr/file-reader-writer')
const { copyToTmp } = require('@bldr/core-node')
const {
  removeSpacesAtLineEnd
} = require('../dist/node/txt.js')

const { operations } = require('../dist/node/operations.js')

const { getConfig } = require('@bldr/config')
const config = getConfig()

function getPath (relPath) {
  return path.join(config.mediaServer.basePath, 'Musik', relPath)
}

describe('txt.ts', function () {
  describe('Operation “patchTexTitles()”', function () {
    it('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex', function () {
      const testFile = getPath(
        '05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'
      )
      operations.patchTexTitles(testFile)

      const content = readFile(testFile)
      assert.ok(content.includes('\\setzetitel{'))
      assert.ok(content.includes('Fach = Musik,'))
    })
  })

  it('Function “removeSpacesAtLineEnd()”', function () {
    assert.strictEqual(removeSpacesAtLineEnd('1 \n2\t\n\n3  \n'), '1\n2\n\n3\n')
  })

  describe('Operation “removeWidthHeightInSvg()”', function () {
    it('multiline', function () {
      const tmpPath = copyToTmp(
        __dirname,
        'files',
        'width-height-multiline.svg'
      )
      operations.removeWidthHeightInSvg(tmpPath)
      assert.ok(!readFile(tmpPath).includes('width='))
    })

    it('single-line', function () {
      const tmpPath = copyToTmp(
        __dirname,
        'files',
        'width-height-single-line.svg'
      )
      operations.removeWidthHeightInSvg(tmpPath)
      assert.ok(!readFile(tmpPath).includes('height='))
    })
  })
})
