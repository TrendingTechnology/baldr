/* globals describe it */

const assert = require('assert')
const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/group')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide “group”', function () {
  this.beforeAll(async function () {
    await presentation.resolve()
  })

  it('short-form', async function () {
    const fields = getFields('short-form')
    assert.strictEqual(fields.groupId, 'Rolling-Stones_The')
  })

  it('long-form', async function () {
    const fields = getFields('long-form')
    assert.strictEqual(fields.groupId, 'Belleville-Three_The')
  })
})
