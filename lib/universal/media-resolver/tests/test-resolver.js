/* globals describe it */

const assert = require('assert')

const { Resolver } = require('../dist/main.js')
const resolver = new Resolver()

describe('File “resolver.ts”', function () {
  describe('Class “Resolver()”', function () {
    it('Method “reset()”', async function () {
      const resolver = new Resolver()
      // ref: Bolero_HB_Bolero
      await resolver.resolve('uuid:538204e4-6171-42d3-924c-b3f80a954a1a')
      assert.strictEqual(resolver.exportAssets().length, 1)
      assert.strictEqual(resolver.exportSamples().length, 10)
      resolver.reset()
      assert.strictEqual(resolver.exportAssets().length, 0)
      assert.strictEqual(resolver.exportSamples().length, 0)
    })

    describe('Method “resolveAsset()”', function () {
      it('ref:', async function () {
        const asset = await resolver.resolveAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island'
        )
        assert.strictEqual(
          asset.uuid,
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
      })

      it('ref:#complete', async function () {
        const asset = await resolver.resolveAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island#complete'
        )
        assert.ok(asset != null)
      })

      it('ref:#xxx', async function () {
        const asset = await resolver.resolveAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island#xxx'
        )
        assert.ok(asset != null)
      })

      it('uuid:', async function () {
        // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
        const asset = await resolver.resolveAsset(
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
        assert.strictEqual(
          asset.uuid,
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
      })
    })

    describe('Resolve URI with fragments', function () {
      const resolver = new Resolver()
      // ref: 'Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew',
      // uuid: 'c64047d2-983d-4009-a35f-02c95534cb53',

      it('uuid without a fragment', async function () {
        const assets = await resolver.resolve(
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
        assert.strictEqual(
          assets[0].uuid,
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
      })

      it('ref without a fragment', async function () {
        const assets = await resolver.resolve(
          'ref:Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew'
        )
        assert.strictEqual(
          assets[0].uuid,
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
      })

      it('uuid with a fragment', async function () {
        const assets = await resolver.resolve(
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53#complete'
        )
        assert.strictEqual(
          assets[0].uuid,
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
      })

      it('ref with a fragment', async function () {
        const assets = await resolver.resolve(
          'ref:Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew#complete'
        )
        assert.strictEqual(
          assets[0].uuid,
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
      })
    })
  })
})
