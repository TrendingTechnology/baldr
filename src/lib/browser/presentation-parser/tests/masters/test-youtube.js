/* globals describe it */

const assert = require('assert')
const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/youtube')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide “youtube”', function () {
  this.beforeAll(async function () {
    await presentation.resolve()
  })

  it('short-form', async function () {
    const fields = getFields('short-form')
    assert.strictEqual(fields.youtubeId, '5BBahdS6wu4')
  })

  it('long-form', async function () {
    const fields = getFields('long-form')
    assert.strictEqual(fields.youtubeId, 'xtKavZG1KiM')
  })

  it('heading', async function () {
    const fields = getFields('heading')
    assert.strictEqual(fields.heading, '<em class="person">Chet Baker</em> Live')
  })
})
