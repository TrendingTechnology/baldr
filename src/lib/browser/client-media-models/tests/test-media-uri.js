/* globals describe it */

const assert = require('assert')

const { MediaUri, findMediaUris } = require('../dist/node/main.js')

describe('Class “MediaUri”', function () {
  it("new MediaUri('ref:Beethoven_Ludwig-van#-4')", function () {
    const uri = new MediaUri('ref:Beethoven_Ludwig-van#-4')
    assert.strictEqual(uri.raw, 'ref:Beethoven_Ludwig-van#-4')
    assert.strictEqual(uri.scheme, 'ref')
    assert.strictEqual(uri.authority, 'Beethoven_Ludwig-van')
    assert.strictEqual(uri.fragment, '-4')
    assert.strictEqual(uri.uriWithoutFragment, 'ref:Beethoven_Ludwig-van')
  })

  it("new MediaUri('uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')", function () {
    const uri = new MediaUri('uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    assert.strictEqual(uri.raw, 'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    assert.strictEqual(uri.scheme, 'uuid')
    assert.strictEqual(uri.authority, 'c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    assert.strictEqual(uri.fragment, undefined)
    assert.strictEqual(
      uri.uriWithoutFragment,
      'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7'
    )
  })

  it("new MediaUri('xxx:xxx')", function () {
    assert.throws(() => new MediaUri('xxx:xxx'))
  })

  it('Static methods', function () {
    assert.strictEqual(MediaUri.removeFragment('ref:test#fragment'), 'ref:test')
    assert.strictEqual(
      MediaUri.removeScheme('ref:test#fragment'),
      'test#fragment'
    )
    assert.deepStrictEqual(MediaUri.splitByFragment('ref:test#fragment'), {
      fragment: 'fragment',
      prefix: 'ref:test'
    })
  })
})

describe('Function “findMediaUris()”', function () {
  it('In an array', function () {
    const uris = new Set()
    findMediaUris(['ref:test'], uris)
    assert.strictEqual(uris.size, 1)
  })

  it('In an object', function () {
    const uris = new Set()
    findMediaUris(
      {
        ref: 'ref:test',
        child: { ref: 'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7' }
      },
      uris
    )
    assert.strictEqual(uris.size, 2)
  })

  it('invalid', function () {
    const uris = new Set()
    findMediaUris(
      {
        ref: 'reftest',
        child: { ref: 'uuid c262fe9b-c705-43fd-a5d4-4bb38178d9e7' }
      },
      uris
    )
    assert.strictEqual(uris.size, 0)
  })
})
