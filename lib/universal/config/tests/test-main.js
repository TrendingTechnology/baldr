/* globals describe it */

import assert from 'assert'

import { getConfig, getMediaPath } from '../dist/node-main'

describe('Package “@bldr/config”', function () {
  it('config', function () {
    const config = getConfig()
    assert.strictEqual('44523', config.api.port)
  })

  it('getMediaPath()', function () {
    const absPath = getMediaPath('test', 'test.txt')
    assert.ok(absPath.indexOf('/test/test.txt') > -1)
  })
})
