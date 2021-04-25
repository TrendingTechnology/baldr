const assert = require('assert')

const { Resolver } = require('../dist/node/main.js')

const resolver = new Resolver()
describe('Package “@bldr/media-resolver”', function () {

  it('resolve single', async function () {
    const assets = await resolver.resolve('uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    assert.strictEqual(assets[0].uri.raw, 'uuid:c64047d2-983d-4009-a35f-02c95534cb53')
  })

})
