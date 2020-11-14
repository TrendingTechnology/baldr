import assert from 'assert'

import config from '@bldr/config'
import { makeHttpRequestInstance } from '@bldr/http-request'

const localHttpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

describe('local: /api/media', function () {
  this.timeout(10000)
  it('/api/media/mgmt/update', async function () {
    const result = await localHttpRequest.request('mgmt/update')
    assert.strictEqual(result.data.finished, true)
    assert.ok(typeof result.data.begin === 'number')
    assert.ok(typeof result.data.end === 'number')
    assert.ok(typeof result.data.duration === 'number')
    assert.ok(typeof result.data.lastCommitId === 'string')
    assert.ok(Array.isArray(result.data.errors))
    assert.strictEqual(result.data.errors.length, 0)
  })
})
