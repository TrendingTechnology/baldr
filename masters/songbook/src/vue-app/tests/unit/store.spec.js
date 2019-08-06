/* globals describe it beforeEach */

import { assert } from 'chai'
import store from '../../src/store'

const songs = {
  'Auf-der-Mauer_auf-der-Lauer': {
    abc: 'a',
    folder: '/tmp/a/Auf-der-Mauer_auf-der-Lauer',
    metaData: {
      artist: 'Volksweise',
      musescore: 5354717,
      title: 'Auf der Mauer, auf der Lauer'
    },
    songID: 'Auf-der-Mauer_auf-der-Lauer',
    slidesCount: 4
  },
  'Stille-Nacht': {
    abc: 's',
    folder: '/tmp/s/Stille-Nacht',
    metaData: {
      arranger: 'Eberhard Kraus, nach dem Orgelbuch „Lob Gottes“',
      composer: 'Franz Gruber (+ 1863)',
      lyricist: 'Josef Mohr (1792-1848)',
      musescore: 5642007,
      title: 'Stille Nacht'
    },
    songID: 'Stille-Nacht',
    slidesCount: 3
  },
  'Swing-low': {
    abc: 's',
    folder: '/tmp/s/Swing-low',
    metaData: {
      genre: 'Spiritual',
      title: 'Swing low'
    },
    songID: 'Swing-low',
    slidesCount: 5
  },
  'Zum-Tanze-da-geht-ein-Maedel': {
    abc: 'z',
    folder: '/tmp/z/Zum-Tanze-da-geht-ein-Maedel',
    metaData: {
      country: 'Schweden',
      musescore: 5641095,
      title: 'Zum Tanze, da geht ein Mädel'
    },
    songID: 'Zum-Tanze-da-geht-ein-Maedel',
    slidesCount: 2
  }
}

describe('@baldr/songbook-vue-app: store', function () {
  beforeEach(function () {
    store.dispatch('importSongs', songs)
    store.dispatch('setSongCurrent', 'Stille-Nacht')
  })

  describe('actions', function () {
    it('importSongs', () => {
      store.dispatch('importSongs', songs)
      store.dispatch('setSongCurrent', 'Stille-Nacht')
      assert.strictEqual(store.getters.songs['Stille-Nacht'].songID, 'Stille-Nacht')
    })

    it('setSongCurrent', function () {
      store.dispatch('setSongCurrent', 'Stille-Nacht')
      assert.strictEqual(store.getters.songCurrent.songID, 'Stille-Nacht')
      assert.strictEqual(store.getters.slideNoCurrent, 1)
    })

    it('setSlideNext', function () {
      assert.strictEqual(store.getters.slideNoCurrent, 1)
      store.dispatch('setSlideNext')
      assert.strictEqual(store.getters.slideNoCurrent, 2)
      store.dispatch('setSlideNext')
      assert.strictEqual(store.getters.slideNoCurrent, 3)
      store.dispatch('setSlideNext')
      assert.strictEqual(store.getters.slideNoCurrent, 1)
      store.dispatch('setSlideNext')
      assert.strictEqual(store.getters.slideNoCurrent, 2)
    })

    it('setSlidePrevious', function () {
      assert.strictEqual(store.getters.slideNoCurrent, 1)
      store.dispatch('setSlidePrevious')
      assert.strictEqual(store.getters.slideNoCurrent, 3)
      store.dispatch('setSlidePrevious')
      assert.strictEqual(store.getters.slideNoCurrent, 2)
      store.dispatch('setSlidePrevious')
      assert.strictEqual(store.getters.slideNoCurrent, 1)
      store.dispatch('setSlidePrevious')
      assert.strictEqual(store.getters.slideNoCurrent, 3)
    })
  })
})
