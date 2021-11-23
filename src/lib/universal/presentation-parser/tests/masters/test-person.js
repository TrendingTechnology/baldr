/* globals describe it */

const assert = require('assert')
const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/person')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide “person”', function () {
  this.beforeAll(async function () {
    await presentation.resolve()
  })

  it('short-form', async function () {
    const fields = getFields('short-form')
    assert.strictEqual(fields.personId, 'Adorno_Theodor-W')
  })

  it('long-form', async function () {
    const fields = getFields('long-form')
    assert.strictEqual(fields.personId, 'Bach_Carl-Philipp-Emanuel')
  })
})
