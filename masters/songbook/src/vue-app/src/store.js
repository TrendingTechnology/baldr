import Vue from 'vue'
import Vuex from 'vuex'
import songs from '/home/jf/.local/share/baldr/projector/songs.json'

Vue.use(Vuex)

/**
 * Sort alphabetically an array of objects by some specific property.
 *
 * @param {String} property Key of the object to sort.
 * @see {@link https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript Tutorial}
 */
function sortObjectsByProperty (property) {
  return function (a, b) {
    return a[property].localeCompare(b[property])
  }
}

/**
 * A tree of songs where the song arrays are placed in alphabetical properties.
 * An instanace of this class would look like this example:
 *
 * <pre><code>
 * {
 *   "a": [ song, song ],
 *   "s": [ song, song ],
 *   "z": [ song, song ]
 * }
 * </code></pre>
 */
class AlphabeticalSongsTree {
  /**
   * @param {module:baldr-songbook~songs} songs - An array of song objects.
   */
  constructor (songs) {
    for (const song of Object.values(songs)) {
      if (!{}.hasOwnProperty.call(this, song.abc)) this[song.abc] = []
      this[song.abc].push(song)
    }
    for (const abc in this) {
      this[abc].sort(sortObjectsByProperty('songID'))
    }
  }
}

export default new Vuex.Store({
  state: {
    slideNoCurrent: 0,
    songCurrent: {},
    songs: {}
  },
  getters: {
    alphabeticalSongsTree: (state, getters) => {
      const songs = getters.songs
      return new AlphabeticalSongsTree(songs)
    },
    slideNoCurrent: (state) => {
      return state.slideNoCurrent
    },
    songCurrent: (state) => {
      return state.songCurrent
    },
    songs: (state) => {
      return state.songs
    }
  },
  actions: {
    importSongs ({ commit }) {
      commit('importSongs', songs)
    },
    setSongCurrent ({ commit, getters }, songID) {
      const song = getters.songs[songID]
      commit('setSongCurrent', song)
    }
  },
  mutations: {
    importSongs (state, songs) {
      state.songs = songs
    },
    setSongCurrent (state, song) {
      state.songCurrent = song
    },
    setSlideNoCurrent (state, slideNoCurrent) {
      state.slideNoCurrent = slideNoCurrent
    }
  }
})
