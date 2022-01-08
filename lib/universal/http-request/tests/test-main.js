/* globals describe it */

import assert from 'assert'

import { getConfig } from '@bldr/config'

import {
  makeHttpRequestInstance,
  checkReachability,
  getHttp
} from '../dist/main'

const config = getConfig()

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

describe('Package “@bldr/http-request”', function () {
  it('assets/by-uuid/c64047d2-983d-4009-a35f-02c95534cb53', async function () {
    const result = await httpRequest.request(
      'assets/by-uuid/c64047d2-983d-4009-a35f-02c95534cb53'
    )
    assert.strictEqual(result.data.composer, 'Modest Petrowitsch Mussorgski')
    assert.strictEqual(result.data.uuid, 'c64047d2-983d-4009-a35f-02c95534cb53')
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

  it('forward: axios.get()', async function () {
    const result = await getHttp('http://tagesschau.de')
    assert.strictEqual(result.status, 200)
  })
})
