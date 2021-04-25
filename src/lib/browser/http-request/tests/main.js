const assert = require('assert')

const config = require('@bldr/config')

const { makeHttpRequestInstance } = require('../dist/node/main.js')

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

describe('Package “@bldr/media-resolver”', function () {

  it('/media/query?type=assets&field=uuid&method=exactMatch&search=c64047d2-983d-4009-a35f-02c95534cb53', async function () {
    const result = await httpRequest.request({
      url: 'query',
      params: {
        type: 'assets',
        field: 'uuid',
        method: 'exactMatch',
        search: 'c64047d2-983d-4009-a35f-02c95534cb53'
      }
    })
    const data = result.data
    assert.strictEqual(data.composer, 'Modest Petrowitsch Mussorgski')
    assert.strictEqual(data.uuid, 'c64047d2-983d-4009-a35f-02c95534cb53')
  })
})
