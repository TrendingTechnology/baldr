/* globals describe it */

import assert from 'assert'

import { parseRealWorldPresentation, parsePresentation } from './_helper'

describe('Class “SlideCollection()”', function () {
  it('Real world example: 12/20_Tradition/10_Umgang-Tradition/10_Futurismus', function () {
    const presentation = parseRealWorldPresentation(
      '12/20_Tradition/10_Umgang-Tradition/10_Futurismus'
    )
    const slides = presentation.slides
    assert.strictEqual(slides.flat[0].no, 1)
    assert.strictEqual(slides.flat[0].level, 1)

    assert.strictEqual(slides.flat[0].master.name, 'cloze')

    // section: Luigi Russolo
    const slide = slides.tree[5]
    assert.strictEqual(slide.no, 6)

    assert.strictEqual(slide.slides[0].master.name, 'task')
    assert.strictEqual(slide.slides[0].level, 2)
    assert.strictEqual(slide.slides[1].master.name, 'scoreSample')
  })

  it('Throws error: no slides', function () {
    assert.throws(
      () => {
        parsePresentation('slide-collection/no-slides')
      },
      {
        message: 'The property “slides” must not be null.',
        name: 'Error'
      }
    )
  })

  it('Throws error: duplicate slide references', function () {
    assert.throws(
      () => {
        parsePresentation('slide-collection/duplicate-slide-ref')
      },
      {
        message: 'Duplicate slide reference: one',
        name: 'Error'
      }
    )
  })

  it('Nested slides', function () {
    const presentation = parsePresentation('slide-collection/nested-slides')
    const tree = presentation.slides.tree
    assert.strictEqual(tree[0].master.name, 'generic')
    assert.strictEqual(tree[0].slides[0].master.name, 'generic')
    assert.strictEqual(tree[0].slides[0].slides[0].master.name, 'generic')
  })

  it('Iterator', function () {
    const presentation = parsePresentation('slide-collection/nested-slides')
    for (const slide of presentation.slides) {
      assert.strictEqual(typeof slide.no, 'number')
    }
  })

  it('Getter attribute “numberOfSlides”', function () {
    const presentation = parsePresentation('slide-collection/nested-slides')
    assert.strictEqual(presentation.slides.numberOfSlides, 3)
  })

  it('Attributes “mediaUris”, “optionalMediaUris”', function () {
    const presentation = parsePresentation('slide-collection/media-uris')
    const slides = presentation.slides
    assert.deepStrictEqual(slides.mediaUris, new Set(['ref:test']))
    assert.deepStrictEqual(
      slides.optionalMediaUris,
      new Set(['ref:YT_12345678901'])
    )
  })
})
