/* globals describe it */
const assert = require('assert')
const path = require('path')

const { readFile } = require('@bldr/file-reader-writer')

const { patchTexTitles } = require('../dist/node/operations/patch-tex-titles')
const {
  removeSpacesAtLineEnd
} = require('../dist/node/operations/fix-typography')

const config = require('@bldr/config')

describe('Package “@bldr/media-manager”', function () {
  describe('Operation “patchTexTitles”', function () {
    it('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex', function () {
      const testFile = path.join(
        config.mediaServer.basePath,
        'Musik/05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'
      )
      patchTexTitles(testFile)

      const content = readFile(testFile)
      assert.ok(content.includes('\\setzetitel{'))
      assert.ok(content.includes('Fach = Musik,'))
    })
  })

  it('Function “removeSpacesAtLineEnd”', function () {
    assert.strictEqual(removeSpacesAtLineEnd('1 \n2\t\n\n3  \n'), '1\n2\n\n3\n')
  })
})
