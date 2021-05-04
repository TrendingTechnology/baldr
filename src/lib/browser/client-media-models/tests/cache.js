/* globals describe it */

const assert = require('assert')
const { createAsset } = require('./_helper.js')
const { assetCache, sampleCache, resetMediaCache, mediaUriCache, MediaUriCache } = require('../dist/node/cache.js')

describe('Class “AssetCache()”', function () {
  it('Method “add()”', function () {
    resetMediaCache()
    createAsset({ ref: 'test1' })
    createAsset({ ref: 'test2' })
    createAsset({ ref: 'test3' })
    assert.strictEqual(assetCache.size, 3)
  })

  it('Method “get(ref)”', function () {
    resetMediaCache()
    const asset1 = createAsset({ ref: 'test1' })
    const asset = assetCache.get(asset1.ref)
    assert.strictEqual(asset.ref, 'test1')
  })

  it('Method “getAll()”', function () {
    resetMediaCache()
    createAsset({ ref: 'test1' })
    const assets = assetCache.getAll()
    assert.strictEqual(assets[0].ref, 'test1')
  })

  it('Getter “size”', function () {
    resetMediaCache()
    createAsset({ ref: 'test1' })
    createAsset({ ref: 'test2' })
    createAsset({ ref: 'test3' })
    assert.strictEqual(assetCache.size, 3)
  })

  it('iterable', function () {
    for (const asset of assetCache) {
      assert.ok(asset.ref)
    }
  })
})

describe('Autofilling of the caches by instantiation', function () {
  it('Create three assets and two samples', function () {
    resetMediaCache()
    createAsset({ ref: 'test1' })
    createAsset({ ref: 'test2' })
    createAsset({ mimeType: 'audio', path: 'dir/test.mp3', ref: 'test3', samples: [{ startTime: 1 }] })
    assert.strictEqual(assetCache.size, 3)
    assert.strictEqual(Object.keys(mediaUriCache.uuids).length, 3)
    assert.strictEqual(sampleCache.size, 2)

    resetMediaCache()
    assert.strictEqual(assetCache.size, 0)
    assert.strictEqual(Object.keys(mediaUriCache.uuids).length, 0)
    assert.strictEqual(sampleCache.size, 0)
  })
})

describe('Class “MediaUriCache()”', function () {
  it('Methode “getRef()”', function () {
    const cache = new MediaUriCache()
    assert.strictEqual(cache.addPair('ref:test', 'uuid:e1eec3bb-3a65-4a9d-bc8c-2e2539a51c4e'), true)
    assert.strictEqual(cache.addPair('ref:test', 'uuid:e1eec3bb-3a65-4a9d-bc8c-2e2539a51c4e'), false)
    assert.strictEqual(cache.addPair('test', 'e1eec3bb-3a65-4a9d-bc8c-2e2539a51c4e'), false)
    assert.strictEqual(cache.getRef('uuid:e1eec3bb-3a65-4a9d-bc8c-2e2539a51c4e'), 'ref:test')
    assert.strictEqual(cache.getRef('uuid:e1eec3bb-3a65-4a9d-bc8c-2e2539a51c4e#fragment'), 'ref:test#fragment')
    assert.strictEqual(cache.getRef('ref:test'), 'ref:test')
    assert.strictEqual(cache.getRef('uuid:e1eec3bb-3a65-4a9d-bc8c-2e2539a51c4e#fragment'), 'ref:test#fragment')
  })
})
