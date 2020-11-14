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

  // '/media/query?type=assets&field=uuid&method=exactMatch&search=c64047d2-983d-4009-a35f-02c95534cb53',
  // '/media/query?type=presentations&field=id&method=exactMatch&search=Beethoven_Marmotte',
  // '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=fullObjects',
  // '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=dynamicSelect'
  it('/media/query?type=assets&field=id&method=exactMatch&search=Egmont-Ouverture', async function () {
    const result = await localHttpRequest.request('mgmt/update')
  })
})
