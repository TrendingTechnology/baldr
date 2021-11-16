/* globals describe it */

const assert = require('assert')
const path = require('path')

const {
  ElementSelector,
  InkscapeSelector
} = require('../dist/node/selector.js')
const { readFile } = require('@bldr/file-reader-writer')
const { getConfig } = require('@bldr/config')
const config = getConfig()

function readMediaFile (relPath) {
  return readFile(path.join(config.mediaServer.basePath, relPath))
}

describe('Class “ElementSelector()”', function () {
  it('Method select(): <p>test</p>', function () {
    const selector = new ElementSelector('<p>test</p>', 'p')
    const steps = selector.select()
    assert.strictEqual(
      steps[0].htmlElement.constructor.name,
      'HTMLParagraphElement'
    )
  })

  it('Method count(): <p>test</p>', function () {
    const selector = new ElementSelector('<p>test</p>', 'p')
    assert.strictEqual(selector.count(), 2)
  })
})

describe('Class “InkscapeSelector()”', function () {
  const inventioString = readMediaFile(
    'Musik/06/20_Mensch-Zeit/10_Bach/30_Invention/NB/Invention_C-Dur_Loesung.svg'
  )
  describe('Invention_C-Dur_Loesung.svg', function () {
    it('layer', function () {
      const selector = new InkscapeSelector(inventioString, 'layer')
      assert.strictEqual(selector.count(), 5)
    })

    it('layer+', function () {
      const selector = new InkscapeSelector(inventioString, 'layer+')
      assert.strictEqual(selector.count(), 49)
    })

    it('group', function () {
      const selector = new InkscapeSelector(inventioString, 'group')
      assert.strictEqual(selector.count(), 1218)
    })
  })

  it('10_Schoenberg-Moses/NB/Notationsweisen.svg', function () {
    const selector = new InkscapeSelector(
      readMediaFile(
        'Musik/11/10_Sprache/30_20-Jahrhundert/10_Schoenberg-Moses/NB/Notationsweisen.svg'
      ),
      'group'
    )
    assert.strictEqual(selector.count(), 5)
  })
})
