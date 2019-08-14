import Vue from 'vue'
import Vuex from 'vuex'
import {
  AlphabeticalSongsTree,
  CoreLibrary,
  SongMetaDataCombined
} from '@bldr/songbook-core'

Vue.use(Vuex)

const state = {
  slideNoCurrent: 0,
  songCurrent: {},
  library: {}
}

const getters = {
  alphabeticalSongsTree: (state, getters) => {
    return new AlphabeticalSongsTree(Object.values(getters.songs))
  },
  externalSites: () => {
    return SongMetaDataCombined.externalSites()
  },
  library: (state) => {
    return state.library
  },
  slideNoCurrent: (state) => {
    return state.slideNoCurrent
  },
  songCurrent: (state) => {
    return state.songCurrent
  },
  songs: (state) => {
    return state.library.songs
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
    commit('updateCurrentSongIndex', songID)
    commit('setSongCurrent', song)
    commit('setSlideNoCurrent', 1)
  },
  setSongNext ({ dispatch, getters }) {
    const song = getters.library.getNextSong()
    dispatch('setSongCurrent', song.songID)
  },
  setSongPrevious ({ dispatch, getters }) {
    const song = getters.library.getPreviousSong()
    dispatch('setSongCurrent', song.songID)
  },
  setSongRandom ({ dispatch, getters }) {
    const song = getters.library.getRandomSong()
    dispatch('setSongCurrent', song.songID)
  }
}

const mutations = {
  importSongs (state, songs) {
    state.library = new CoreLibrary(songs)
  },
  setSlideNoCurrent (state, slideNoCurrent) {
    state.slideNoCurrent = parseInt(slideNoCurrent)
  },
  setSongCurrent (state, song) {
    state.songCurrent = song
  },
  updateCurrentSongIndex (state, songID) {
    state.library.updateCurrentSongIndex(songID)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
