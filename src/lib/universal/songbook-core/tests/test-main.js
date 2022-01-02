/* globals describe it beforeEach */

const assert = require('assert')

const { SongMetaDataCombined } = require('../dist/node/main.js')

describe('Package “@bldr/songbook-core”', function () {
  it('Class “SongMetaDataCombined()”', function () {
    const song = new SongMetaDataCombined({composer: 'Ludwig van', title: 'Für Elise'})
    assert.strictEqual(song.composer, 'Ludwig van')
  })
})
