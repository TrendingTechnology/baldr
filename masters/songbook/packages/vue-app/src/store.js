import Vue from 'vue'
import Vuex from 'vuex'
import songs from '/home/jf/.local/share/baldr/projector/songs.json'
import AlphabeticalSongsTree from '@bldr/songbook-base'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    slideNoCurrent: 0,
    songCurrent: {},
    songs: {}
  },
  getters: {
    AlphabeticalSongsTree: (state, getters) => {
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
    }
  }
})
