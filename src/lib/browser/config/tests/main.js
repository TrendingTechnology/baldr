const assert = require('assert')

const config = require('../src/node/main.js')

describe('Package “@bldr/config”', function () {
  it('config', function () {
    assert.strictEqual('44523', config.api.port)
  })
})
