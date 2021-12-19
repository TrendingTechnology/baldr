/* globals describe it */
import assert from 'assert'

import { getConfig } from '../dist/main-node.js'

describe('Package “@bldr/config”', function () {
  it('config', function () {
    const config = getConfig()
    assert.strictEqual('44523', config.api.port)
  })
})
