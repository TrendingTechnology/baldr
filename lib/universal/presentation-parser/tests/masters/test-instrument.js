/* globals describe it */

import assert from 'assert'

import { parsePresentation } from '../_helper'

const presentation = parsePresentation('masters/instrument')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide “instrument”', function () {
  this.beforeAll(async function () {
    await presentation.resolve()
  })

  it('short-form', async function () {
    const fields = getFields('short-form')
    assert.strictEqual(fields.instrumentId, 'Floete')
  })

  it('long-form', async function () {
    const fields = getFields('long-form')
    assert.strictEqual(fields.instrumentId, 'Fagott')
  })
})
