/* globals describe it */

const assert = require('assert')

const { makeHttpRequestInstance } = require('@bldr/http-request')
const { getConfig } = require('@bldr/config')
const config = getConfig()

const { restart } = require('../dist/node/main')

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

describe('media', function () {
  it('mgmt/update', async function () {
    this.timeout(10000)
    restart()

    const result = await httpRequest.request('mgmt/update')
    assert.strictEqual(result.data.finished, true)
    assert.ok(typeof result.data.begin === 'number')
    assert.ok(typeof result.data.end === 'number')
    assert.ok(typeof result.data.duration === 'number')
    assert.ok(typeof result.data.lastCommitId === 'string')
    assert.ok(Array.isArray(result.data.errors))
    assert.strictEqual(result.data.errors.length, 0)
  })

  describe('get', function () {
    describe('asset', function () {
      it('?ref=IN_Cembalo', async function () {
        const result = await httpRequest.request({
          url: 'get/asset',
          params: {
            ref: 'IN_Cembalo'
          }
        })
        const data = result.data
        assert.strictEqual(data.ref, 'IN_Cembalo')
        assert.strictEqual(data.uuid, '0f741f26-f861-4c17-a4a4-c12dcd8375d9')
        assert.strictEqual(data.wikidata, 'Q81982')
      })

      it('?uuid=c64047d2-983d-4009-a35f-02c95534cb53', async function () {
        const result = await httpRequest.request({
          url: 'get/asset',
          params: {
            uuid: 'c64047d2-983d-4009-a35f-02c95534cb53'
          }
        })
        const data = result.data
        assert.strictEqual(data.composer, 'Modest Petrowitsch Mussorgski')
        assert.strictEqual(data.uuid, 'c64047d2-983d-4009-a35f-02c95534cb53')
      })
    })

    it('presentation/by-ref?ref=Marmotte', async function () {
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

    it('presentations/by-substring?search=Ausstellung', async function () {
      const result = await httpRequest.request({
        url: 'get/presentations/by-substring',
        params: {
          search: 'Ausstellung'
        }
      })
      assert.ok(!result.data[0].uuid)
      assert.ok(result.data[0].ref)
      assert.ok(result.data[0].name)
    })

    it('folder-title-tree', async function () {
      const result = await httpRequest.request('get/folder-title-tree')
      assert.ok(result.data.Musik != null)
    })
  })

  describe('stats', function () {
    it('count', async function () {
      const result = await httpRequest.request('stats/count')
      assert.ok(result.data.assets > 0)
      assert.ok(result.data.presentations > 0)
    })

    it('updates', async function () {
      const result = await httpRequest.request('stats/updates')
      const updateTask = result.data[0]
      assert.strictEqual(typeof updateTask.begin, 'number')
      assert.strictEqual(typeof updateTask.end, 'number')
      assert.strictEqual(typeof updateTask.lastCommitId, 'string')
    })
  })

  describe('open', function () {
    describe('editor', function () {
      it('presentation', async function () {
        const result = await httpRequest.request({
          url: 'open/editor',
          params: {
            'dry-run': true,
            ref: 'Marmotte',
            type: 'presentations'
          }
        })

        assert.strictEqual(result.data.ref, 'Marmotte')
        assert.ok(
          result.data.absPath.includes(
            'Marmotte/Praesentation.baldr.yml'
          )
        )
        assert.strictEqual(result.data.editor, '/usr/bin/code')
      })

      it('asset', async function () {
        const result = await httpRequest.request({
          url: 'open/editor',
          params: {
            'dry-run': true,
            ref: 'IN_Cembalo',
            type: 'assets'
          }
        })
        assert.strictEqual(result.data.ref, 'IN_Cembalo')
        assert.ok(
          result.data.absPath.includes(
            'Musik/Instrumente/c/Cembalo/main.jpg.yml'
          )
        )
        assert.ok(
          result.data.parentFolder.includes(
            'Musik/Instrumente/c/Cembalo'
          )
        )
      })
    })
  })
})
