/* globals describe it */
const assert = require('assert')

const { getSnippet, checkAvailability } = require('../dist/node/main.js')

describe('Package “@bldr/youtube-api”', function () {
  this.timeout(10000)
  describe('Function “getSnippet()”', function () {
    it('jNQXAC9IVRw: Me at the zoo', async function () {
      const snippet = await getSnippet('jNQXAC9IVRw')
      assert.strictEqual(snippet.title, 'Me at the zoo')
    })

    it('xxxxxxxxxxx: Not available', async function () {
      const snippet = await getSnippet('xxxxxxxxxxx')
      assert.strictEqual(snippet, undefined)
    })
  })

  describe('Function “checkAvailability()”', function () {
    it('jNQXAC9IVRw: Me at the zoo', async function () {
      const result = await checkAvailability('jNQXAC9IVRw')
      assert.strictEqual(result, true)
    })

    it('xxxxxxxxxxx: Not available', async function () {
      const result = await checkAvailability('xxxxxxxxxxx')
      assert.strictEqual(result, false)
    })
  })
})
