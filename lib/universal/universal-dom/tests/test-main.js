/* globals describe it */

import assert from 'assert'
import path from 'path'

import { readFile } from '@bldr/file-reader-writer'
import { getConfig } from '@bldr/config'

import { DOMParserU, documentU, locationU } from '../dist/node-main'

const config = getConfig()

describe('Package “@bldr/universal-dom”', function () {
  describe('DOMParserU', function () {
    it('html', function () {
      const dom = new DOMParserU().parseFromString('<p>test</p>', 'text/html')
      const p = dom.querySelector('p')
      assert.strictEqual(p.textContent, 'test')
    })

    it('svg', function () {
      const svgDom = new DOMParserU().parseFromString(
        readFile(
          path.join(
            config.mediaServer.basePath,
            'Musik/06/20_Mensch-Zeit/10_Bach/30_Invention/NB/Invention_C-Dur_Loesung.svg'
          )
        ),
        'image/svg+xml'
      )
      assert.strictEqual(svgDom.querySelectorAll('svg g').length, 1217)
      // Musik/11/10_Sprache/30_20-Jahrhundert/10_Schoenberg-Moses/NB/Notationsweisen.svg
    })
  })

  it('documentU', function () {
    const textNode = documentU.createTextNode('test')
    assert.strictEqual(textNode.textContent, 'test')
  })

  it('locationU', function () {
    assert.strictEqual(locationU.hostname, 'localhost')
  })
})
