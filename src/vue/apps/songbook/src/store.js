import { Vue, Vuex } from '@bldr/vue-packages-bundler'
import {
  AlphabeticalSongsTree,
  CoreLibrary,
  SongMetaDataCombined
} from '@bldr/songbook-core'

Vue.use(Vuex)

const state = {
  slideNo: 0,
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
  library: state => {
    return state.library
  },
  slideNo: state => {
    return state.slideNo
  },
  songCurrent: state => {
    return state.songCurrent
  },
  songs: state => {
    return state.library.songs
  }
}

const actions = {
  browseAllSlidesNext ({ commit, getters, dispatch }) {
    const no = getters.slideNo
    const count = getters.songCurrent.slidesCount
    if (no === count) {
      dispatch('setSongNext')
    } else {
      commit('setSlideNoCurrent', no + 1)
    }
  },
  browseAllSlidesPrevious ({ commit, getters, dispatch }) {
    const no = getters.slideNo
    if (no === 1) {
      dispatch('setSongPrevious')
      commit('setSlideNoCurrent', getters.songCurrent.slidesCount)
    } else {
      commit('setSlideNoCurrent', no - 1)
    }
  },
  importSongs ({ commit }, songs) {
    for (const songId in songs) {
      const song = songs[songId]
      song.metaDataCombined = new SongMetaDataCombined(song.metaData)
    }
    commit('importSongs', songs)
  },
  setSlideNext ({ commit, getters }) {
    const no = getters.slideNo
    const count = getters.songCurrent.slidesCount
    if (no === count) {
      commit('setSlideNoCurrent', 1)
    } else {
      commit('setSlideNoCurrent', no + 1)
    }
  },
  setSlidePrevious ({ commit, getters }) {
    const no = getters.slideNo
    const count = getters.songCurrent.slidesCount
    if (no === 1) {
      commit('setSlideNoCurrent', count)
    } else {
      commit('setSlideNoCurrent', no - 1)
    }
  },
  setSongCurrent ({ commit, getters }, songId) {
    const song = getters.songs[songId]
    commit('updateCurrentSongIndex', songId)
    commit('setSongCurrent', song)
    commit('setSlideNoCurrent', 1)
  },
  setSongNext ({ dispatch, getters }) {
    const song = getters.library.getNextSong()
    dispatch('setSongCurrent', song.songId)
  },
  setSongPrevious ({ dispatch, getters }) {
    const song = getters.library.getPreviousSong()
    dispatch('setSongCurrent', song.songId)
  },
  setSongRandom ({ dispatch, getters }) {
    const song = getters.library.getRandomSong()
    dispatch('setSongCurrent', song.songId)
  }
}

const mutations = {
  importSongs (state, songs) {
    state.library = new CoreLibrary(songs)
  },
  setSlideNoCurrent (state, slideNo) {
    state.slideNo = parseInt(slideNo)
  },
  setSongCurrent (state, song) {
    state.songCurrent = song
  },
  updateCurrentSongIndex (state, songId) {
    state.library.updateCurrentSongIndex(songId)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
