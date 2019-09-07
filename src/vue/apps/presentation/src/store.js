
import Vue from 'vue'
import Vuex from 'vuex'
import { parseContentFile } from '@/content-file.js'

Vue.use(Vuex)

const state = {
  media: {},
  mediaDevices: [],
  slideNoCurrent: null,
  slides: {}
}

const getters = {
  media: state => {
    return state.media
  },
  isMedia: (state, getters) => {
    return Object.keys(getters.media).length > 0
  },
  mediaDevices: state => {
    return state.mediaDevices
  },
  mediaDevicesDynamicSelect: (state, getters) => {
    const resultList = []
    for (const device of getters.mediaDevices) {
      if (device.kind === 'videoinput') {
        let label
        if (device.label) {
          label = device.label
        } else {
          label = `${device.kind} (${device.deviceId})`
        }
        resultList.push({
          id: device.deviceId,
          name: label
        })
      }
    }
    return resultList
  },
  slideNoCurrent: state => {
    return state.slideNoCurrent
  },
  slideCurrent: state => {
    if (state.slideNoCurrent) {
      return state.slides[state.slideNoCurrent]
    }
  },
  slides: state => {
    return state.slides
  },
  slidesCount: (state, getters) => {
    return Object.keys(getters.slides).length
  }
}

const actions = {
  async setMediaDevices ({ commit }) {
    commit('setMediaDevices', await navigator.mediaDevices.enumerateDevices())
  },
  openPresentation ({ commit }, content) {
    const contentFile = parseContentFile(content)
    commit('setSlides', contentFile.slides)
    commit('setSlideNoCurrent', 1)
  },
  setSlideNext ({ commit, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.slidesCount
    if (no === count) {
      commit('setSlideNoCurrent', 1)
    } else {
      commit('setSlideNoCurrent', no + 1)
    }
  },
  setSlidePrevious ({ commit, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.slidesCount
    if (no === 1) {
      commit('setSlideNoCurrent', count)
    } else {
      commit('setSlideNoCurrent', no - 1)
    }
  },
  setStepNext ({ commit, getters }) {
    let stepNoCurrent
    const slideCurrent = getters.slideCurrent
    const no = slideCurrent.master.stepNoCurrent
    const count = slideCurrent.master.stepCount
    if (no === count) {
      stepNoCurrent = 1
    } else {
      stepNoCurrent = no + 1
    }
    commit('setStepNoCurrent', { slideCurrent, stepNoCurrent })
  },
  setStepPrevious ({ commit, getters }) {
    let stepNoCurrent
    const slideCurrent = getters.slideCurrent
    const no = slideCurrent.master.stepNoCurrent
    const count = slideCurrent.master.stepCount
    if (no === 1) {
      stepNoCurrent = count
    } else {
      stepNoCurrent = no - 1
    }
    commit('setStepNoCurrent', { slideCurrent, stepNoCurrent })
  }
}

const mutations = {
  setMediaDevices (state, mediaDevices) {
    state.mediaDevices = mediaDevices
  },
  setSlides (state, slides) {
    Vue.set(state, 'slides', slides)
  },
  setSlideNoCurrent (state, slideNoCurrent) {
    state.slideNoCurrent = parseInt(slideNoCurrent)
  },
  setStepNoCurrent (state, { slideCurrent, stepNoCurrent }) {
    slideCurrent.master.stepNoCurrent = stepNoCurrent
  },
  addMediumData (state, mediumData) {
    Vue.set(state.media, mediumData.URI, mediumData)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
