/* globals describe it */
const assert = require('assert')
const path = require('path')
const fs = require('fs')
const { readFile } = require('@bldr/file-reader-writer')
const { copyToTmp } = require('@bldr/core-node')
const {
  removeSpacesAtLineEnd
} = require('../dist/node/operations/fix-typography')

const { operations } = require('../dist/node/operations.js')

const config = require('@bldr/config')

function getPath (relPath) {
  return path.join(config.mediaServer.basePath, 'Musik', relPath)
}

describe('Package “@bldr/media-manager”', function () {
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

  it('Operation “renameByRef()”', function () {
    const testPath = getPath(
      '09/20_Kontext/20_Romantik/10_Programmmusik/35_Ausstellung/10_Ausstellung-Ueberblick/YT/sPg1qlLjUVQ.mp4'
    )
    operations.renameByRef(testPath)
    assert.ok(fs.existsSync(testPath))
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
