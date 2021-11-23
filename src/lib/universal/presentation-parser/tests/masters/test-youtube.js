/* globals describe it */

const assert = require('assert')
const { parsePresentation } = require('../_helper.js')

const { youtubeMaster } = require('../../dist/node/main.js')

const presentation = parsePresentation('masters/youtube')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide “youtube”', function () {
  this.timeout(10000)

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

  describe('Function “getSnippet()”', function () {
    it('jNQXAC9IVRw: Me at the zoo', async function () {
      const snippet = await youtubeMaster.getSnippet('jNQXAC9IVRw')
      assert.strictEqual(snippet.title, 'Me at the zoo')
    })

    it('xxxxxxxxxxx: Not available', async function () {
      const snippet = await youtubeMaster.getSnippet('xxxxxxxxxxx')
      assert.strictEqual(snippet, undefined)
    })
  })

  describe('Function “checkAvailability()”', function () {
    it('jNQXAC9IVRw: Me at the zoo', async function () {
      const result = await youtubeMaster.checkAvailability('jNQXAC9IVRw')
      assert.strictEqual(result, true)
    })

    it('xxxxxxxxxxx: Not available', async function () {
      const result = await youtubeMaster.checkAvailability('xxxxxxxxxxx')
      assert.strictEqual(result, false)
    })
  })
})
