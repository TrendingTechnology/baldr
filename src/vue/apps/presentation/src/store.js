
import Vue from 'vue'
import Vuex from 'vuex'
import { parseContentFile } from '@/content-file.js'
import { request } from '@/media.js'

Vue.use(Vuex)

const state = {
  media: {},
  restApiServers: [],
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
  restApiServers: state => {
    return state.restApiServers
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
  },
  async setRestApiServers ({ commit }) {
    const servers = await request.getServers()
    commit('setRestApiServers', servers)
  }
}

const mutations = {
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
  },
  setRestApiServers (state, restApiServers) {
    Vue.set(state, 'restApiServers', restApiServers)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
