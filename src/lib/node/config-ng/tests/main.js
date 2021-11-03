const assert = require('assert')

const { getConfig } = require('../dist/node/node-main.js')

describe('Package “@bldr/config”', function () {
  it('config', function () {
    const config = getConfig()
    assert.strictEqual('44523', config.api.port)
  })
})
