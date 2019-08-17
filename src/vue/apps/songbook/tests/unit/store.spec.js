/* globals describe it beforeEach */

import { assert } from 'chai'
import store from '../../src/store'

const songs = {
  'Auf-der-Mauer': {
    abc: 'a',
    folder: '/tmp/a/Auf-der-Mauer',
    metaData: {
      artist: 'Volksweise',
      musescore: 5354717,
      title: 'Auf der Mauer, auf der Lauer'
    },
    songID: 'Auf-der-Mauer',
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
  'Zum-Tanze': {
    abc: 'z',
    folder: '/tmp/z/Zum-Tanze',
    metaData: {
      country: 'Schweden',
      musescore: 5641095,
      title: 'Zum Tanze, da geht ein Mädel'
    },
    songID: 'Zum-Tanze',
    slidesCount: 2
  }
}

describe('@baldr/songbook-vue-app: store', function () {
  beforeEach(function () {
    store.dispatch('importSongs', songs)
    store.dispatch('setSongCurrent', 'Stille-Nacht')
  })

  describe('getters', function () {
    it('alphabeticalSongsTree', function () {
      const tree = store.getters.alphabeticalSongsTree
      assert.strictEqual(tree.a[0].songID, 'Auf-der-Mauer')
    })

    it('library', function () {
      assert.strictEqual(
        store.getters.library.songs['Auf-der-Mauer'].songID,
        'Auf-der-Mauer'
      )
    })

    it('slideNoCurrent', function () {
      assert.strictEqual(store.getters.slideNoCurrent, 1)
    })

    it('songCurrent', function () {
      assert.strictEqual(store.getters.songCurrent.songID, 'Stille-Nacht')
    })

    it('songs', function () {
      assert.strictEqual(
        store.getters.songs['Auf-der-Mauer'].songID, 'Auf-der-Mauer'
      )
    })
  })

  describe('actions', function () {
    it('importSongs', () => {
      store.dispatch('importSongs', songs)
      store.dispatch('setSongCurrent', 'Stille-Nacht')
      assert.strictEqual(store.getters.songs['Stille-Nacht'].songID, 'Stille-Nacht')
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

    it('setSongCurrent', function () {
      store.dispatch('setSongCurrent', 'Stille-Nacht')
      assert.strictEqual(store.getters.songCurrent.songID, 'Stille-Nacht')
      assert.strictEqual(store.getters.slideNoCurrent, 1)
    })

    it('setSongNext', function () {
      store.dispatch('setSongCurrent', 'Auf-der-Mauer')
      store.dispatch('setSongNext')
      assert.strictEqual(store.getters.songCurrent.songID, 'Stille-Nacht')
      store.dispatch('setSongNext')
      assert.strictEqual(store.getters.songCurrent.songID, 'Swing-low')
      store.dispatch('setSongNext')
      assert.strictEqual(store.getters.songCurrent.songID, 'Zum-Tanze')
      store.dispatch('setSongNext')
      assert.strictEqual(store.getters.songCurrent.songID, 'Auf-der-Mauer')
    })

    it('setSongPrevious', function () {
      store.dispatch('setSongCurrent', 'Auf-der-Mauer')
      store.dispatch('setSongPrevious')
      assert.strictEqual(store.getters.songCurrent.songID, 'Zum-Tanze')
      store.dispatch('setSongPrevious')
      assert.strictEqual(store.getters.songCurrent.songID, 'Swing-low')
      store.dispatch('setSongPrevious')
      assert.strictEqual(store.getters.songCurrent.songID, 'Stille-Nacht')
      store.dispatch('setSongPrevious')
      assert.strictEqual(store.getters.songCurrent.songID, 'Auf-der-Mauer')
    })

    it('setSongRandom', function () {
      const oldSongID = store.getters.songCurrent.songID
      store.dispatch('setSongRandom')
      const newSongID = store.getters.songCurrent.songID
      assert.notStrictEqual(oldSongID, newSongID)
    })
  })
})
