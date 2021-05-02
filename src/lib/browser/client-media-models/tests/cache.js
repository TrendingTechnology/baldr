/* globals describe it */

const assert = require('assert')
const { createAsset } = require('./_helper.js')
const { assetCache, sampleCache, AssetCache, resetMediaCache, mediaUriCache } = require('../dist/node/cache.js')

resetMediaCache()

const asset1 = createAsset({ ref: 'test1' })
const asset2 = createAsset({ ref: 'test2' })
const asset3 = createAsset({ ref: 'test3' })

describe('Class “AssetCache()”', function () {
  it('Method “add()”', function () {
    resetMediaCache()
    const cache = new AssetCache()
    cache.add(asset1.ref, asset1)
    cache.add(asset2.ref, asset2)
    cache.add(asset3.ref, asset3)
    assert.strictEqual(cache.size, 3)
  })

  it('Method “get(ref)”', function () {
    resetMediaCache()
    const cache = new AssetCache()
    cache.add(asset1.ref, asset1)
    const asset = assetCache.get(asset1.ref)
    console.log(cache)
    console.log(asset1.ref)
    console.log(mediaUriCache)
    assert.strictEqual(asset.ref, 'test1')
  })

  it('Method “getAll()”', function () {
    resetMediaCache()
    const cache = new AssetCache()
    cache.add(asset1.ref, asset1)
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
    assert.strictEqual(Object.keys(mediaUriCache.refs).length, 3)
    assert.strictEqual(Object.keys(mediaUriCache.uuids).length, 3)
    assert.strictEqual(sampleCache.size, 2)

    resetMediaCache()
    assert.strictEqual(assetCache.size, 0)
    assert.strictEqual(Object.keys(mediaUriCache.refs).length, 0)
    assert.strictEqual(Object.keys(mediaUriCache.uuids).length, 0)
    assert.strictEqual(sampleCache.size, 0)
  })
})
