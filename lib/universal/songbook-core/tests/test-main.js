/* globals describe it beforeEach */

import assert from 'assert'

import { SongMetaDataCombined } from '../dist/main'

describe('Package “@bldr/songbook-core”', function () {
  it('Class “SongMetaDataCombined()”', function () {
    const song = new SongMetaDataCombined({
      composer: 'Ludwig van',
      title: 'Für Elise'
    })
    assert.strictEqual(song.composer, 'Ludwig van')
  })
})
