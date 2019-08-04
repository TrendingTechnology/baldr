import Vue from 'vue'
import Vuex from 'vuex'
import songs from '/home/jf/.local/share/baldr/projector/songs.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    songs: {}
  },
  getters: {
    songs: (state) => {
      return state.songs
    }
  },
  mutations: {
    importSongs (state, songs) {
      state.songs = songs
    }
  },
  actions: {
    importSongs ({ commit }) {
      commit('importSongs', songs)
    }
  }
})
