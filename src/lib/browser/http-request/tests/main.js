/* globals describe it */
const assert = require('assert')

const config = require('@bldr/config')

const {
  makeHttpRequestInstance,
  checkReachability
} = require('../dist/node/main.js')

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

  it('HTTP URL 404: https://img.youtube.com/vi/xxxxxxxxxxx/hqdefault.jpg', async function () {
    assert.rejects(async () => {
      await httpRequest.request({
        url: 'https://img.youtube.com/vi/xxxxxxxxxxx/hqdefault.jpg'
      })
    })
  })

  it('HTTP URL 200: https://img.youtube.com/vi/5BBahdS6wu4/hqdefault.jpg', async function () {
    const result = await httpRequest.request({
      url: 'https://img.youtube.com/vi/5BBahdS6wu4/hqdefault.jpg'
    })
    assert.strictEqual(result.status, 200)
  })

  it('Function “checkReachability()”: HTTP URL 404: https://img.youtube.com/vi/xxxxxxxxxxx/hqdefault.jpg', async function () {
    const result = await checkReachability(
      'https://img.youtube.com/vi/xxxxxxxxxxx/hqdefault.jpg'
    )
    assert.strictEqual(result, false)
  })

  it('Function “checkReachability()”: HTTP URL 200: https://img.youtube.com/vi/5BBahdS6wu4/hqdefault.jpg', async function () {
    const result = await checkReachability(
      'https://img.youtube.com/vi/5BBahdS6wu4/hqdefault.jpg'
    )
    assert.strictEqual(result, true)
  })
})
