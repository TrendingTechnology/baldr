/* globals describe it */
const assert = require('assert')
const path = require('path')

const { readFile } = require('@bldr/file-reader-writer')

const { patchTexTitles } = require('../dist/node/operations/patch-tex-titles')
const config = require('@bldr/config')

describe('Package “@bldr/media-manager”', function () {
  describe('Operation “DeepTitle”', function () {
    it('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex', function () {
      const testFile = path.join(
        config.mediaServer.basePath,
        'musik/05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'
      )
      patchTexTitles(testFile)

      const content = readFile(testFile)

      console.log(content)
    })
  })
})
