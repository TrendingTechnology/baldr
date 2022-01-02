/* globals describe it */

const assert = require('assert')

const { MediaUri, findMediaUris } = require('../dist/node/main.js')

describe('Class “MediaUri”', function () {
  describe("new MediaUri('ref:Beethoven_Ludwig-van#-4')", function () {
    const uri = new MediaUri('ref:Beethoven_Ludwig-van#-4')

    it('Property “raw”', function () {
      assert.strictEqual(uri.raw, 'ref:Beethoven_Ludwig-van#-4')
    })

    it('Property “scheme”', function () {
      assert.strictEqual(uri.scheme, 'ref')
    })

    it('Property “authority”', function () {
      assert.strictEqual(uri.authority, 'Beethoven_Ludwig-van')
    })

    it('Property “fragment”', function () {
      assert.strictEqual(uri.fragment, '-4')
    })

    it('Property “uriWithoutFragment”', function () {
      assert.strictEqual(uri.uriWithoutFragment, 'ref:Beethoven_Ludwig-van')
    })
  })

  describe("new MediaUri('uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')", function () {
    const uri = new MediaUri('uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')

    it('Property “raw”', function () {
      assert.strictEqual(uri.raw, 'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    })

    it('Property “scheme”', function () {
      assert.strictEqual(uri.scheme, 'uuid')
    })

    it('Property “authority”', function () {
      assert.strictEqual(uri.authority, 'c262fe9b-c705-43fd-a5d4-4bb38178d9e7')
    })

    it('Property “fragment”', function () {
      assert.strictEqual(uri.fragment, undefined)
    })

    it('Property “uriWithoutFragment”', function () {
      assert.strictEqual(
        uri.uriWithoutFragment,
        'uuid:c262fe9b-c705-43fd-a5d4-4bb38178d9e7'
      )
    })
  })

  it("Throws an error: new MediaUri('xxx:xxx')", function () {
    assert.throws(() => new MediaUri('xxx:xxx'))
  })

  describe('Static methods', function () {
    it('Static method “check()”', function () {
      assert.deepStrictEqual(MediaUri.check('ref:test#fragment'), true)
      assert.deepStrictEqual(MediaUri.check('xxx:test#fragment'), false)
    })

    it('Static method “validate()”', function () {
      assert.deepStrictEqual(
        MediaUri.validate('ref:test#fragment'),
        'ref:test#fragment'
      )
      assert.throws(() => MediaUri.validate('xxx:test#fragment'))
    })

    it('Static method “splitByFragment()”', function () {
      assert.deepStrictEqual(MediaUri.splitByFragment('ref:test#fragment'), {
        fragment: 'fragment',
        prefix: 'ref:test'
      })
    })

    it('Static method “removeFragment()”', function () {
      assert.strictEqual(
        MediaUri.removeFragment('ref:test#fragment'),
        'ref:test'
      )
    })

    it('Static method “removeScheme()”', function () {
      assert.strictEqual(
        MediaUri.removeScheme('ref:test#fragment'),
        'test#fragment'
      )
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
