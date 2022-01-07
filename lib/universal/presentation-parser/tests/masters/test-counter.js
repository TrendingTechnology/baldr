/* globals describe it */

const assert = require('assert')
const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/counter')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide “counter”', function () {
  it('short-form', async function () {
    const fields = getFields('short-form')
    assert.strictEqual(fields.to, 7)
  })

  it('long-form', async function () {
    const fields = getFields('long-form')
    assert.strictEqual(fields.to, 3)
  })

  it('format-arabic', async function () {
    const fields = getFields('format-arabic')
    assert.deepStrictEqual(fields.counterElements, ['1', '2', '3'])
  })

  it('format-lower', async function () {
    const fields = getFields('format-lower')
    assert.deepStrictEqual(fields.counterElements, ['a', 'b', 'c'])
  })

  it('format-upper', async function () {
    const fields = getFields('format-upper')
    assert.deepStrictEqual(fields.counterElements, ['A', 'B', 'C'])
  })

  it('format-roman', async function () {
    const fields = getFields('format-roman')
    assert.deepStrictEqual(fields.counterElements, ['I', 'II', 'III'])
  })
})
