/**
 * @file vuex store
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { callMasterFunc } from '@/masters.js'
import { Presentation } from './content-file'

Vue.use(Vuex)

const state = {
  slideNoCurrent: null,
  slides: {},
  presentation: {}
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
  async openPresentation ({ commit, dispatch }, content) {
    const presentation = new Presentation()
    await presentation.parseYamlFile(content)
    commit('setPresentation', presentation)
    commit('setSlides', presentation.slides)
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
    let oldProps
    let newSlide = getters.slideByNo(no)
    let newProps = newSlide.renderData.data
    let context = new Vue()
    if (getters.slideCurrent) {
      oldSlide = getters.slideCurrent
      oldProps = oldSlide.renderData.data
      callMasterFunc(getters.slideCurrent.renderData.name, 'leaveSlide', { oldSlide, oldProps, newSlide, newProps }, context)
    }
    commit('setSlideNoCurrent', no)
    callMasterFunc(getters.slideCurrent.renderData.name, 'enterSlide', { oldSlide, oldProps, newSlide, newProps }, context)
  },
  setStepNext ({ dispatch, getters }) {
    let stepNoCurrent
    const slideCurrent = getters.slideCurrent
    const no = slideCurrent.renderData.stepNoCurrent
    const count = slideCurrent.renderData.stepCount
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
    const no = slideCurrent.renderData.stepNoCurrent
    const count = slideCurrent.renderData.stepCount
    if (no === 1) {
      stepNoCurrent = count
    } else {
      stepNoCurrent = no - 1
    }
    dispatch('setStepNoCurrent', { slideCurrent, stepNoCurrent })
  },
  setStepNoCurrent ({ commit }, { slideCurrent, stepNoCurrent }) {
    let oldStepNo = slideCurrent.renderData.stepNoCurrent
    let newStepNo = stepNoCurrent
    callMasterFunc(slideCurrent.renderData.name, 'leaveStep', { oldStepNo, newStepNo }, new Vue())
    commit('setStepNoCurrent', { slideCurrent, stepNoCurrent })
    callMasterFunc(slideCurrent.renderData.name, 'enterStep', { oldStepNo, newStepNo }, new Vue())
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
    slideCurrent.renderData.stepNoCurrent = stepNoCurrent
  },
  setPresentation (state, presentation) {
    Vue.set(state, 'presentation', presentation)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
