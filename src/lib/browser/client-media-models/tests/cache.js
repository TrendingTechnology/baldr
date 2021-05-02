/* globals describe it */

const assert = require('assert')
const { createAsset } = require('./_helper.js')
const { AssetCache } = require('../dist/node/cache.js')

const asset1 = createAsset({ ref: 'test1' })
const asset2 = createAsset({ ref: 'test2' })
const asset3 = createAsset({ ref: 'test3' })

const assetCache = new AssetCache()
assetCache.add(asset1.ref, asset1)
assetCache.add(asset2.ref, asset2)
assetCache.add(asset3.ref, asset3)

describe('Class “AssetCache()”', function () {
  it('Method “add()”', function () {
    const cache = new AssetCache()
    cache.add(asset1.ref, asset1)
    cache.add(asset2.ref, asset2)
    cache.add(asset3.ref, asset3)
    assert.strictEqual(cache.size, 3)
  })

  it('Method “get(ref)”', function () {
    const asset = assetCache.get(asset1.ref)
    assert.strictEqual(asset.ref, 'test1')
  })

  it('Method “getAll()”', function () {
    const assets = assetCache.getAll()
    assert.strictEqual(assets[0].ref, 'test1')
  })

  it('Getter “size”', function () {
    assert.strictEqual(assetCache.size, 3)
  })

  it('iterable', function () {
    for (const asset of assetCache) {
      assert.ok(asset.ref)
    }
  })
})
