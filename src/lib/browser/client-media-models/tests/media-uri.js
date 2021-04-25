const assert = require('assert')

const { MediaUri, findMediaUris } = require('../dist/node/main.js')

describe('Class “MediaUri”', function () {
  it('new MediaUri(\'id:Beethoven_Ludwig-van#-4\')', function () {
    const uri = new MediaUri('id:Beethoven_Ludwig-van#-4')
    assert.strictEqual(uri.raw, 'id:Beethoven_Ludwig-van#-4')
    assert.strictEqual(uri.scheme, 'id')
    assert.strictEqual(uri.authority, 'Beethoven_Ludwig-van')
    assert.strictEqual(uri.fragment, '-4')
    assert.strictEqual(uri.uriWithoutFragment, 'id:Beethoven_Ludwig-van')
  })

  it('new MediaUri(\'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7\')', function () {
    const uri = new MediaUri('uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    assert.strictEqual(uri.raw, 'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    assert.strictEqual(uri.scheme, 'uuid')
    assert.strictEqual(uri.authority, 'c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    assert.strictEqual(uri.fragment, undefined)
    assert.strictEqual(uri.uriWithoutFragment, 'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
  })

  it('new MediaUri(\'xxx:xxx\')', function () {
    assert.throws(() => new MediaUri('xxx:xxx'))
  })

})

describe('Function “findMediaUris()”', function () {
  it('In an array', function () {
    uris = new Set()
    findMediaUris(['id:test'], uris)
    assert.strictEqual(uris.size, 1)
  })

  it('In an object', function () {
    uris = new Set()
    findMediaUris({ id: 'id:test', child: { id: 'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7' } }, uris)
    assert.strictEqual(uris.size, 2)
  })

  it('invalid', function () {
    uris = new Set()
    findMediaUris({ id: 'idtest', child: { id: 'uuid c262fe9b-c705-43fd-a5d4-4bb38178d9e7' } }, uris)
    assert.strictEqual(uris.size, 0)
  })

})
