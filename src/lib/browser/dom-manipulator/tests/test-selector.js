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
      '<h1 id="heading-1">heading 1</h1><span class="word-area"><p><span class="word">one</span></p> <h2 id="heading-2"><span class="word">heading</span> <span class="word">2</span></h2> <p><span class="word">two</span></p> <h3 id="heading-3"><span class="word">heading</span> <span class="word">3</span></h3> <p><span class="word">three</span>'

    const selector = new WordSelector(markup)
    const steps = selector.select()
    assert.strictEqual(selector.count(), 8)
    assert.deepStrictEqual(WordSelector.collectStepTexts(steps), [
      'one',
      'heading',
      '2',
      'two',
      'heading',
      '3',
      'three'
    ])
  })
})
