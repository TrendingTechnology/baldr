/* globals describe it */

const assert = require('assert')

const {
  ElementSelector,
  InkscapeSelector,
  ClozeSelector,
  WordSelector
} = require('../dist/node/selector.js')

const { wrapWords } = require('../dist/node/manipulation.js')
const { readFile } = require('@bldr/file-reader-writer')
const { getMediaPath } = require('@bldr/config')

function readMediaFile (relPath) {
  return readFile(getMediaPath(relPath))
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
  this.timeout(10000)
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

describe('Class “ClozeSelector()”', function () {
  it('10_Mozart/30_Nachtmusik/LT/1.svg', function () {
    const svgString = readMediaFile(
      'Musik/05/20_Mensch-Zeit/10_Mozart/30_Nachtmusik/LT/1.svg'
    )
    const selector = new ClozeSelector(svgString)
    assert.strictEqual(selector.count(), 23)
  })
})

describe('Class “WordSelector()”', function () {
  it('h1 ul li', function () {
    const markup = wrapWords(
      '<h1>heading</h1><ul><li>one</li><li>two</li><li>three four</li></ul>'
    )
    const selector = new WordSelector(markup)
    const steps = selector.select()
    assert.strictEqual(selector.count(), 6)
    assert.deepStrictEqual(WordSelector.collectStepTexts(steps), [
      'heading',
      'one',
      'two',
      'three',
      'four'
    ])
    // heading
    assert.strictEqual(steps[0].htmlElements.length, 1)
    // one
    assert.strictEqual(steps[1].htmlElements.length, 3)
    // two
    assert.strictEqual(steps[2].htmlElements.length, 2)
    // three
    assert.strictEqual(steps[3].htmlElements.length, 2)
    // four
    assert.strictEqual(steps[4].htmlElements.length, 1)
  })

  it('note heading underline', function () {
    const markup =
      '<p><span class="word">no-heading</span></p> ' +
      '<h2>' +
      '<span class="word">first</span> ' +
      '<span class="word">middle</span> ' +
      '<span class="word">last</span>' +
      '</h2>' +
      '<p><span class="word">no-heading</span></p>'
    const selector = new WordSelector(markup)
    const steps = selector.select()
    assert.strictEqual(selector.count(), 6)
    assert.deepStrictEqual(WordSelector.collectStepTexts(steps), [
      'no-heading',
      'first',
      'middle',
      'last',
      'no-heading'
    ])

    // no-heading
    assert.strictEqual(steps[0].onShow, undefined)
    // first
    assert.strictEqual(typeof steps[1].onShow, 'function')
    assert.strictEqual(steps[1].onHide, undefined)
    // middle
    assert.strictEqual(steps[2].onShow, undefined)
    // last
    assert.strictEqual(typeof steps[3].onShow, 'function')
    assert.strictEqual(typeof steps[3].onHide, 'function')
    // no-heading
    assert.strictEqual(steps[4].onShow, undefined)
  })
})
