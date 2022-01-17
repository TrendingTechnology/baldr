/* globals describe it */
import assert from 'assert'
import path from 'path'

import { readFile } from '@bldr/file-reader-writer'
import { copyToTmp } from '@bldr/node-utils'
import { getConfig } from '@bldr/config'

import { removeSpacesAtLineEnd } from '../dist/txt'
import { operations } from '../dist/operations'

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
        new URL('.', import.meta.url).pathname,
        'files',
        'width-height-multiline.svg'
      )
      operations.removeWidthHeightInSvg(tmpPath)
      assert.ok(!readFile(tmpPath).includes('width='))
    })

    it('single-line', function () {
      const tmpPath = copyToTmp(
        new URL('.', import.meta.url).pathname,
        'files',
        'width-height-single-line.svg'
      )
      operations.removeWidthHeightInSvg(tmpPath)
      assert.ok(!readFile(tmpPath).includes('height='))
    })
  })
})
