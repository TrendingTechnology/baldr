const assert = require('assert')

const { MediaUri } = require('../dist/node/main.js')

describe('Class “MediaUri”', function () {
  it('new MediaUri(\'id:Beethoven_Ludwig-van#-4\')', function () {
    const uri = new MediaUri('id:Beethoven_Ludwig-van#-4')
    assert.strictEqual(uri.uri, 'id:Beethoven_Ludwig-van#-4')
    assert.strictEqual(uri.scheme, 'id')
    assert.strictEqual(uri.authority, 'Beethoven_Ludwig-van')
    assert.strictEqual(uri.fragment, '-4')
    assert.strictEqual(uri.uriWithoutFragment, 'id:Beethoven_Ludwig-van')
  })

  it('new MediaUri(\'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7\')', function () {
    const uri = new MediaUri('uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    assert.strictEqual(uri.uri, 'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    assert.strictEqual(uri.scheme, 'uuid')
    assert.strictEqual(uri.authority, 'c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    assert.strictEqual(uri.fragment, undefined)
    assert.strictEqual(uri.uriWithoutFragment, 'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
  })

  it('new MediaUri(\'xxx:xxx\')', function () {
    assert.throws(() => new MediaUri('xxx:xxx'))
  })

})
