/* globals describe it */

const assert = require('assert')

const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/generic')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getMarkup (ref) {
  const slide = getSlide(ref)
  return slide.fields.markup
}

describe('Master slide “generic”', function () {
  it('short-form', function () {
    const markup = getMarkup('short-form')
    assert.strictEqual(markup.length, 1)
    assert.deepStrictEqual(markup, ['<p>Lorem</p>'])
  })

  it('long-form', function () {
    const markup = getMarkup('long-form')
    assert.strictEqual(markup.length, 1)
    assert.deepStrictEqual(markup, ['<p>Lorem</p>'])
  })

  it('hr', function () {
    const markup = getMarkup('hr')
    assert.strictEqual(markup.length, 3)
    assert.deepStrictEqual(markup, [
      '<p>Step 1</p>',
      '<p>Step 2</p>',
      '<p>Step 3</p>'
    ])
  })

  it('input-as-array', function () {
    const markup = getMarkup('input-as-array')
    assert.strictEqual(markup.length, 2)
    assert.deepStrictEqual(markup, ['<p>Step 1</p>', '<p>Step 2</p>'])
  })

  it('long-text-markdown', function () {
    const markup = getMarkup('long-text-markdown')
    assert.strictEqual(markup.length, 6)
    assert.ok(markup[0].indexOf('</h1>') > -1)
  })
})
