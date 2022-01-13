/* globals describe it */

import assert from 'assert'

import { parsePresentation } from '../_helper'

const presentation = parsePresentation('masters/website')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide website”', function () {
  it('short-form', async function () {
    const fields = getFields('short-form')
    assert.strictEqual(
      fields.url,
      'https://www.sachsen.schule/~terra2014/index.php'
    )
  })

  it('long-form', async function () {
    const fields = getFields('long-form')
    assert.strictEqual(
      fields.url,
      'https://dbup2date.uni-bayreuth.de/index.html'
    )
  })
})
