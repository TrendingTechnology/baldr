import assert from 'assert'

import config from '@bldr/config'
import { makeHttpRequestInstance, HttpRequest } from '@bldr/http-request'

const localHttpRequest = makeHttpRequestInstance(config, 'local', '/api/media')
const remoteHttpRequest = makeHttpRequestInstance(config, 'remote', '/api/media')

let httpRequest: HttpRequest = localHttpRequest

function runTests () {
  it('/api/media/mgmt/update', async function () {
    const result = await httpRequest.request('mgmt/update')
    assert.strictEqual(result.data.finished, true)
    assert.ok(typeof result.data.begin === 'number')
    assert.ok(typeof result.data.end === 'number')
    assert.ok(typeof result.data.duration === 'number')
    assert.ok(typeof result.data.lastCommitId === 'string')
    assert.ok(Array.isArray(result.data.errors))
    assert.strictEqual(result.data.errors.length, 0)
  })

  it('/media/query?type=assets&field=id&method=exactMatch&search=IN_Cembalo', async function () {
    const result = await httpRequest.request({
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

  it('/media/query?type=presentations&field=id&method=exactMatch&search=Marmotte', async function () {
    const result = await httpRequest.request({
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
    const result = await httpRequest.request({
      url: 'query',
      params: {
        type: 'presentations',
        field: 'id',
        method: 'exactMatch',
        search: 'Marmotte'
      }
    })
    assert.strictEqual(result.data.meta.id, 'Marmotte')
    assert.ok(typeof result.data.path === 'string')
    assert.ok(typeof result.data.filename === 'string')
  })

  it('/media/query?type=assets&field=path&method=substringSearch&search=Ausstellung&result=fullObjects', async function () {
    const result = await httpRequest.request({
      url: 'query',
      params: {
        type: 'assets',
        field: 'path',
        method: 'substringSearch',
        search: 'Ausstellung',
        result: 'fullObjects'
      }
    })
    assert.ok(typeof result.data[0].uuid === 'string')
  })

  it('/media/query?type=assets&field=path&method=substringSearch&search=Ausstellung&result=dynamicSelect', async function () {
    const result = await httpRequest.request({
      url: 'query',
      params: {
        type: 'assets',
        field: 'path',
        method: 'substringSearch',
        search: 'Ausstellung',
        result: 'dynamicSelect'
      }
    })
    assert.ok(!result.data[0].uuid)
    assert.ok(result.data[0].id)
    assert.ok(result.data[0].name)
  })

  it('/media/stats/count', async function () {
    const result = await httpRequest.request('stats/count')
    assert.ok(result.data.assets > 0)
    assert.ok(result.data.presentations > 0)
  })

}

describe('local: /api/media', runTests)
httpRequest = remoteHttpRequest
describe('remote: /api/media', runTests)
