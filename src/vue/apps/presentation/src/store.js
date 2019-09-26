
import Vue from 'vue'
import Vuex from 'vuex'
import { parseContentFile } from '@/content-file.js'
import { callMasterFunc } from '@/masters.js'

Vue.use(Vuex)

const state = {
  slideNoCurrent: null,
  slides: {}
}

const getters = {
  slideNoCurrent: state => {
    return state.slideNoCurrent
  },
  slideCurrent: state => {
    if (state.slideNoCurrent) {
      return state.slides[state.slideNoCurrent]
    }
  },
  slideByNo: state => no => {
    return state.slides[no]
  },
  slides: state => {
    return state.slides
  },
  slidesCount: (state, getters) => {
    return Object.keys(getters.slides).length
  }
}

const actions = {
  openPresentation ({ commit, dispatch }, content) {
    const contentFile = parseContentFile(content)
    commit('setSlides', contentFile.slides)
    dispatch('setSlideNoCurrent', 1)
  },
  setSlideNext ({ dispatch, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.slidesCount
    if (no === count) {
      dispatch('setSlideNoCurrent', 1)
    } else {
      dispatch('setSlideNoCurrent', no + 1)
    }
  },
  setSlidePrevious ({ dispatch, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.slidesCount
    if (no === 1) {
      dispatch('setSlideNoCurrent', count)
    } else {
      dispatch('setSlideNoCurrent', no - 1)
    }
  },
  setSlideNoCurrent ({ commit, getters }, no) {
    let oldSlide
    let newSlide = getters.slideByNo(no)
    if (getters.slideCurrent) {
      oldSlide = getters.slideCurrent
      callMasterFunc(getters.slideCurrent.master.name, 'leaveSlide', { oldSlide, newSlide }, new Vue())
    }
    commit('setSlideNoCurrent', no)
    callMasterFunc(getters.slideCurrent.master.name, 'enterSlide', { oldSlide, newSlide }, new Vue())
  },
  setStepNext ({ dispatch, getters }) {
    let stepNoCurrent
    const slideCurrent = getters.slideCurrent
    const no = slideCurrent.master.stepNoCurrent
    const count = slideCurrent.master.stepCount
    if (no === count) {
      stepNoCurrent = 1
    } else {
      stepNoCurrent = no + 1
    }
    dispatch('setStepNoCurrent', { slideCurrent, stepNoCurrent })
  },
  setStepPrevious ({ dispatch, getters }) {
    let stepNoCurrent
    const slideCurrent = getters.slideCurrent
    const no = slideCurrent.master.stepNoCurrent
    const count = slideCurrent.master.stepCount
    if (no === 1) {
      stepNoCurrent = count
    } else {
      stepNoCurrent = no - 1
    }
    dispatch('setStepNoCurrent', { slideCurrent, stepNoCurrent })
  },
  setStepNoCurrent ({ commit }, { slideCurrent, stepNoCurrent }) {
    let oldStepNo = slideCurrent.master.stepNoCurrent
    let newStepNo = stepNoCurrent
    callMasterFunc(slideCurrent.master.name, 'leaveStep', { oldStepNo, newStepNo }, new Vue())
    commit('setStepNoCurrent', { slideCurrent, stepNoCurrent })
    callMasterFunc(slideCurrent.master.name, 'enterStep', { oldStepNo, newStepNo }, new Vue())
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
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
