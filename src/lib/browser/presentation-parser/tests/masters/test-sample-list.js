/* globals describe it */

const assert = require('assert')

const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/sample-list')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide “sample-list”', function () {
  this.beforeAll(async function () {
    await presentation.resolve()
  })

  it('short-form-array', async function () {
    const fields = getFields('short-form-array')
    assert.strictEqual(fields.samples.length, 4)
    assert.strictEqual(
      fields.samples[0].uri,
      'uuid:96626fdb-4ece-47a5-9870-d89356e0f439'
    )
  })

  it('fuzzy-uris', async function () {
    const fields = getFields('fuzzy-uris')
    assert.strictEqual(
      fields.samples[0].uri,
      'ref:Schubert-Schaefer_HB_Bach_Sinfonia-aus-Weihnachtsoratorium'
    )

    assert.strictEqual(
      fields.samples[0].title,
      '<em class="person">Bach</em>: Weihnachts-Oratorium Teil 2 BWV 248: Sinfonia'
    )

    assert.strictEqual(fields.notNumbered, true)
    assert.strictEqual(fields.heading, 'Berühmte Pastoralen')
  })

  it('single-asset', async function () {
    const fields = getFields('single-asset')
    assert.strictEqual(fields.samples.length, 12)
  })
})
