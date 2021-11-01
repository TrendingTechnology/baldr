/* globals describe it */

const assert = require('assert')
const {
  parseRealWorldPresentation,
  parseTestPresentation
} = require('./_helper.js')

describe('Class “SlideCollection()”', function () {
  it('real world example', function () {
    const presentation = parseRealWorldPresentation(
      '12/20_Tradition/10_Umgang-Tradition/10_Futurismus'
    )
    const slides = presentation.slides
    assert.strictEqual(slides.flat[0].no, 1)
    assert.strictEqual(slides.flat[0].level, 1)

    assert.strictEqual(slides.flat[0].master.name, 'document')

    // section: Luigi Russolo
    const slide = slides.tree[4]
    assert.strictEqual(slide.no, 5)

    assert.strictEqual(slide.slides[0].master.name, 'task')
    assert.strictEqual(slide.slides[0].level, 2)
    assert.strictEqual(slide.slides[1].master.name, 'scoreSample')
  })

  it('throws error: no slides', function () {
    assert.throws(
      () => {
        parseTestPresentation('no-slides')
      },
      {
        message: 'The property “slides” must not be null.',
        name: 'Error'
      }
    )
  })

  it('Nested slides', function () {
    const presentation = parseTestPresentation('nested-slides')
    const tree = presentation.slides.tree
    assert.strictEqual(tree[0].master.name, 'generic')
    assert.strictEqual(tree[0].slides[0].master.name, 'generic')
    assert.strictEqual(tree[0].slides[0].slides[0].master.name, 'generic')
  })

  it('iterator', function () {
    const presentation = parseTestPresentation('nested-slides')
    for (const slide of presentation.slides) {
      assert.strictEqual(typeof slide.no, 'number')
    }
  })

  it('getter attribute “numberOfSlides”', function () {
    const presentation = parseTestPresentation('nested-slides')
    assert.strictEqual(presentation.slides.numberOfSlides, 3)
  })
})
