import Vue from 'vue'
import Vuex from 'vuex'
import {
  AlphabeticalSongsTree,
  SongMetaDataCombined
} from '@bldr/songbook-core'

Vue.use(Vuex)

const state = {
  slideNoCurrent: 0,
  songCurrent: {},
  songs: {}
}

const getters = {
  alphabeticalSongsTree: (state, getters) => {
    return new AlphabeticalSongsTree(Object.values(getters.songs))
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
}

const actions = {
  importSongs ({ commit }, songs) {
    for (const songID in songs) {
      const song = songs[songID]
      song.metaDataCombined = new SongMetaDataCombined(song.metaData)
    }
    commit('importSongs', songs)
  },
  setSlideNext ({ commit, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.songCurrent.slidesCount
    if (no === count) {
      commit('setSlideNoCurrent', 1)
    } else {
      commit('setSlideNoCurrent', no + 1)
    }
  },
  setSlidePrevious ({ commit, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.songCurrent.slidesCount
    if (no === 1) {
      commit('setSlideNoCurrent', count)
    } else {
      commit('setSlideNoCurrent', no - 1)
    }
  },
  setSongCurrent ({ commit, getters }, songID) {
    const song = getters.songs[songID]
    commit('setSongCurrent', song)
    commit('setSlideNoCurrent', 1)
  }
}

const mutations = {
  importSongs (state, songs) {
    state.songs = songs
  },
  setSlideNoCurrent (state, slideNoCurrent) {
    state.slideNoCurrent = parseInt(slideNoCurrent)
  },
  setSongCurrent (state, song) {
    state.songCurrent = song
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
