/* globals describe it  */
const assert = require('assert')

const wrapper = require('../dist/node/main.js')

describe('Package “@bldr/api-wrapper”', function () {
  this.timeout(20000)
  it('Function “updateMediaServer()”', async function () {
    const result = await wrapper.updateMediaServer()
    assert.strictEqual(result.finished, true)
    assert.strictEqual(typeof result.begin, 'number')
  })

  it('Function “getStatsCount()”', async function () {
    const result = await wrapper.getStatsCount()
    assert.strictEqual(typeof result.assets, 'number')
    assert.strictEqual(typeof result.presentations, 'number')
  })

  it('Function “getStatsUpdates()”', async function () {
    const result = await wrapper.getStatsUpdates()
    assert.strictEqual(typeof result[0].begin, 'number')
    assert.strictEqual(typeof result[0].end, 'number')
    assert.strictEqual(typeof result[0].lastCommitId, 'string')
  })
})
