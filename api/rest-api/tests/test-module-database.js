/* globals describe it */

import assert from 'assert'

import { makeHttpRequestInstance } from '@bldr/http-request'

import { getConfig } from '@bldr/config'

import { restart } from '../dist/main'

const config = getConfig()

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
