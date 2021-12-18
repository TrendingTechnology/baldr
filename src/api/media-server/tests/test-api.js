/* globals describe it */

const assert = require('assert')
const childProcess = require('child_process')

const { makeHttpRequestInstance } = require('@bldr/http-request')
const { getConfig } = require('@bldr/config')
const { msleep } = require('@bldr/core-browser')
const config = getConfig()
const localHttpRequest = makeHttpRequestInstance(config, 'local', '/api/media')
// const remoteHttpRequest = makeHttpRequestInstance(config, 'remote', '/api/media')

const httpRequest = localHttpRequest

function runTests () {
  it('/api/media/mgmt/update', async function () {
    this.timeout(10000)
    const p = childProcess.spawnSync('systemctl', [
      '--user',
      'restart',
      'baldr_api.service'
    ])
    if (p.status !== 0) {
      throw new Error(
        'The restart of the systemd service baldr_api.service failed!'
      )
    }

    msleep(1500)

    const result = await httpRequest.request('mgmt/update')
    assert.strictEqual(result.data.finished, true)
    assert.ok(typeof result.data.begin === 'number')
    assert.ok(typeof result.data.end === 'number')
    assert.ok(typeof result.data.duration === 'number')
    assert.ok(typeof result.data.lastCommitId === 'string')
    assert.ok(Array.isArray(result.data.errors))
    assert.strictEqual(result.data.errors.length, 0)
  })

  it('/media/query?type=assets&field=ref&method=exactMatch&search=IN_Cembalo', async function () {
    const result = await httpRequest.request({
      url: 'query',
      params: {
        type: 'assets',
        field: 'ref',
        method: 'exactMatch',
        search: 'IN_Cembalo'
      }
    })
    const data = result.data
    assert.strictEqual(data.ref, 'IN_Cembalo')
    assert.strictEqual(data.uuid, '0f741f26-f861-4c17-a4a4-c12dcd8375d9')
    assert.strictEqual(data.wikidata, 'Q81982')
  })

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

  it('/media/get/presentation/by-ref?ref=Marmotte', async function () {
    const result = await httpRequest.request({
      url: 'get/presentation/by-ref',
      params: {
        ref: 'Marmotte'
      }
    })
    const data = result.data
    assert.strictEqual(data.meta.ref, 'Marmotte')
    assert.strictEqual(
      data.meta.path,
      'Musik/07/20_Mensch-Zeit/10_Beethoven/50_Marmotte/Praesentation.baldr.yml'
    )
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
    assert.ok(result.data[0].ref)
    assert.ok(result.data[0].name)
  })

  it('/media/stats/count', async function () {
    const result = await httpRequest.request('stats/count')
    assert.ok(result.data.assets > 0)
    assert.ok(result.data.presentations > 0)
  })

  it('/media/stats/updates', async function () {
    const result = await httpRequest.request('stats/updates')
    const updateTask = result.data[0]
    assert.strictEqual(typeof updateTask.begin, 'number')
    assert.strictEqual(typeof updateTask.end, 'number')
    assert.strictEqual(typeof updateTask.lastCommitId, 'string')
  })

  it('/media/get/folder-title-tree', async function () {
    const result = await httpRequest.request('get/folder-title-tree')
    assert.ok(result.data.Musik != null)
  })
}

describe('local: /api/media', runTests)
// httpRequest = remoteHttpRequest
// describe('remote: /api/media', runTests)
