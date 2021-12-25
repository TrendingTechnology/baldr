/* globals describe it */

const assert = require('assert')

const { makeHttpRequestInstance } = require('@bldr/http-request')
const { getConfig } = require('@bldr/config')
const config = getConfig()

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/database')

describe('/database', function () {
  it('POST / (update)', async function () {
    const result = await httpRequest.request({
      url: '',
      method: 'POST'
    })
    assert.strictEqual(result.data.assets.name, 'assets')
  })
})
