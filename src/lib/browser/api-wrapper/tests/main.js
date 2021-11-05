/* globals describe it  */
const assert = require('assert')

const { updateMediaServer } = require('../dist/node/main.js')

describe('Package “@bldr/api-wrapper”', function () {
  this.timeout(20000)
  it('Linked over cover', async function () {
    const result = await updateMediaServer()
    assert.strictEqual(result.finished, true)
    assert.strictEqual(typeof result.begin, 'number')
  })
})
