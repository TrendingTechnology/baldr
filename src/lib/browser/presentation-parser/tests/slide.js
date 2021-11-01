/* globals describe it */

const assert = require('assert')
const { parseTestPresentation } = require('./_helper.js')

describe('Class “Slide()”', function () {
  it('Basic attributes', function () {
    const presentation = parseTestPresentation('slide-meta')
    const slide = presentation.slides.flat[0]
    assert.strictEqual(slide.level, 1)
    assert.strictEqual(slide.no, 1)
  })

  it('Metadata', function () {
    const presentation = parseTestPresentation('slide-meta')
    const slide = presentation.slides.flat[0]
    assert.strictEqual(slide.meta.ref, 'Reference')
    assert.strictEqual(slide.meta.title, 'Title')
    assert.strictEqual(slide.meta.description, 'Description')
    assert.strictEqual(slide.meta.source, 'Source')
  })

  it('Slide state absent', function () {
    const presentation = parseTestPresentation('slide-state-absent')
    assert.strictEqual(presentation.slides.numberOfSlides, 1)
    const slide = presentation.slides.flat[0]
    assert.strictEqual(slide.meta.title, 'Present')
  })

  it('throws error: Unknown master', function () {
    assert.throws(
      () => {
        parseTestPresentation('unknown-master')
      },
      {
        message: 'No master slide found: {"unknownMaster":"test"}',
        name: 'Error'
      }
    )
  })
})
