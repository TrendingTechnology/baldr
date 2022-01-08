/* globals describe it */

import assert from 'assert'

import { makeHttpRequestInstance } from '@bldr/http-request'
import { getConfig } from '@bldr/config'

import { restart } from '../dist/main'

const config = getConfig()

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

describe('/media', function () {
  it('PUT / (update)', async function () {
    restart(2000)

    const result = await httpRequest.request({ url: '', method: 'PUT' })
    assert.ok(typeof result.data.begin === 'number')
    assert.ok(typeof result.data.end === 'number')
    assert.ok(typeof result.data.duration === 'number')
    assert.ok(typeof result.data.lastCommitId === 'string')
    assert.ok(Array.isArray(result.data.errors))
    assert.strictEqual(result.data.errors.length, 0)
  })

  it('GET / (statistics)', async function () {
    const result = await httpRequest.request({ url: '' })
    const data = result.data

    assert.ok(data.count.assets > 0)
    assert.ok(data.count.presentations > 0)

    const updateTask = data.updateTasks[0]
    assert.strictEqual(typeof updateTask.begin, 'number')
    assert.strictEqual(typeof updateTask.end, 'number')
    assert.strictEqual(typeof updateTask.lastCommitId, 'string')
  })

  it('DELETE / (flush media files)', async function () {
    const result = await httpRequest.request({
      url: '',
      method: 'DELETE'
    })
    assert.ok(result.data.numberOfDroppedAssets > 0)
    assert.ok(result.data.numberOfDroppedPresentations > 0)

    // update
    await httpRequest.request({ url: '', method: 'PUT' })
  })

  it('GET titles', async function () {
    const result = await httpRequest.request('titles')
    assert.ok(result.data.Musik != null)
  })

  describe('presentations', function () {
    it('GET by-ref/Marmotte', async function () {
      const result = await httpRequest.request('presentations/by-ref/Marmotte')
      assert.strictEqual(
        result.data.meta.uuid,
        'de007e7e-b255-4a4e-92a1-0819d7f046cf'
      )
      assert.strictEqual(
        result.data.meta.path,
        'Musik/07/20_Mensch-Zeit/10_Beethoven/50_Marmotte/Praesentation.baldr.yml'
      )
    })

    it('GET by-uuid/de007e7e-b255-4a4e-92a1-0819d7f046cf', async function () {
      const result = await httpRequest.request(
        'presentations/by-uuid/de007e7e-b255-4a4e-92a1-0819d7f046cf'
      )
      assert.strictEqual(result.data.meta.ref, 'Marmotte')
    })
  })

  describe('assets', function () {
    it('GET by-ref/IN_Cembalo', async function () {
      const result = await httpRequest.request('assets/by-ref/IN_Cembalo')
      const data = result.data
      assert.strictEqual(data.ref, 'IN_Cembalo')
      assert.strictEqual(data.uuid, '0f741f26-f861-4c17-a4a4-c12dcd8375d9')
      assert.strictEqual(data.wikidata, 'Q81982')
    })

    it('GET by-uuid/c64047d2-983d-4009-a35f-02c95534cb53', async function () {
      const result = await httpRequest.request(
        'assets/by-uuid/c64047d2-983d-4009-a35f-02c95534cb53'
      )
      const data = result.data
      assert.strictEqual(data.composer, 'Modest Petrowitsch Mussorgski')
      assert.strictEqual(data.uuid, 'c64047d2-983d-4009-a35f-02c95534cb53')
    })

    it('GET refs', async function () {
      const result = await httpRequest.request('assets/refs')
      assert.ok(result.data.includes('PR_Mussorgski_Modest'))
    })

    it('GET uuids', async function () {
      const result = await httpRequest.request('assets/uuids')
      assert.ok(result.data.includes('c64047d2-983d-4009-a35f-02c95534cb53'))
    })

    it('GET uris', async function () {
      const result = await httpRequest.request('assets/uris')
      assert.ok(result.data.includes('ref:PR_Mussorgski_Modest'))
      assert.ok(
        result.data.includes('uuid:c64047d2-983d-4009-a35f-02c95534cb53')
      )
    })
  })
})

describe('get', function () {
  describe('asset', function () {
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
  })

  describe('open', function () {
    describe('editor', function () {
      it('presentation', async function () {
        const result = await httpRequest.request({
          url: 'open/editor',
          params: {
            'dry-run': true,
            ref: 'Marmotte',
            type: 'presentation'
          }
        })

        assert.strictEqual(result.data.ref, 'Marmotte')
        assert.ok(
          result.data.absPath.includes('Marmotte/Praesentation.baldr.yml')
        )
        assert.strictEqual(result.data.editor, '/usr/bin/code')
      })

      it('asset', async function () {
        const result = await httpRequest.request({
          url: 'open/editor',
          params: {
            'dry-run': true,
            ref: 'IN_Cembalo',
            type: 'asset'
          }
        })
        assert.strictEqual(result.data.ref, 'IN_Cembalo')
        assert.ok(
          result.data.absPath.includes(
            'Musik/Instrumente/c/Cembalo/main.jpg.yml'
          )
        )
        assert.ok(
          result.data.parentFolder.includes('Musik/Instrumente/c/Cembalo')
        )
      })
    })

    describe('file-manager', function () {
      it('presentation', async function () {
        const result = await httpRequest.request({
          url: 'open/file-manager',
          params: {
            ref: 'Marmotte',
            type: 'presentation',
            'dry-run': true
          }
        })
        console.log(result.data)
        assert.strictEqual(result.data.ref, 'Marmotte')
        // assert.ok(
        //   result.data.parentFolders[0].includes('Marmotte')
        // )
      })
    })
  })
})
