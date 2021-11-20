/* globals describe it */

const assert = require('assert')
const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/section')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide “section”', function () {
  it('short-form', async function () {
    const fields = getFields('short-form')
    assert.strictEqual(fields.heading, 'A section')
  })

  it('long-form', async function () {
    const fields = getFields('long-form')
    assert.strictEqual(fields.heading, 'Another section')
  })

  it('markdown', async function () {
    const fields = getFields('markdown')
    assert.strictEqual(fields.heading, '<em>Lorem</em> <strong>ipsum</strong>')
  })
})
