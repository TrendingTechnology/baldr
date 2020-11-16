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

  it('/media/query?type=assets&field=id&method=exactMatch&search=IN_Cembalo', async function () {
    const result = await localHttpRequest.request({
      url: 'query',
      params: {
        type: 'assets',
        field: 'id',
        method: 'exactMatch',
        search: 'IN_Cembalo'
      }
    })
    const data = result.data
    assert.strictEqual(data.id, 'IN_Cembalo')
    assert.strictEqual(data.uuid, '0f741f26-f861-4c17-a4a4-c12dcd8375d9')
    assert.strictEqual(data.wikidata, 'Q81982')
  })

  it('/media/query?type=assets&field=id&method=exactMatch&search=c64047d2-983d-4009-a35f-02c95534cb53', async function () {
    const result = await localHttpRequest.request({
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

  it('/media/query?type=presentations&field=id&method=exactMatch&search=Marmotte', async function () {
    const result = await localHttpRequest.request({
      url: 'query',
      params: {
        type: 'presentations',
        field: 'id',
        method: 'exactMatch',
        search: 'Marmotte'
      }
    })
    const data = result.data
    assert.strictEqual(data.meta.id, 'Marmotte')
    assert.ok(typeof data.path === 'string')
    assert.ok(typeof data.filename === 'string')
  })

  it('/media/query?type=presentations&field=id&method=exactMatch&search=Marmotte', async function () {
    const result = await localHttpRequest.request({
      url: 'query',
      params: {
        type: 'presentations',
        field: 'id',
        method: 'exactMatch',
        search: 'Marmotte'
      }
    })
    const data = result.data
    assert.strictEqual(data.meta.id, 'Marmotte')
    assert.ok(typeof data.path === 'string')
    assert.ok(typeof data.filename === 'string')
  })

  // '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=fullObjects',
  // '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=dynamicSelect'
})
