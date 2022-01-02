/* globals describe it */

const assert = require('assert')

const { makeHttpRequestInstance } = require('@bldr/http-request')
const { getConfig } = require('@bldr/config')
const config = getConfig()

const { restart } = require('../dist/node/main')

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/database')

describe('/database', function () {
  it('POST / (reinitalize)', async function () {
    restart(2000)
    const result = await httpRequest.request({
      url: '',
      method: 'POST'
    })
    assert.ok(result.data.resultDrop.droppedCollections.includes('assets'))
    assert.strictEqual(result.data.resultInit.assets.name, 'assets')
  })
})
