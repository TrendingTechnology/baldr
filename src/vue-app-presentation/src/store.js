/**
 * @file vuex store
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { Presentation } from './content-file'
import vue from '@/main.js'
import { customStore } from '@/main.js'

Vue.use(Vuex)

const state = {
  folderTitleTree: null,
  presentation: {},
  preview: {
    size: 0.6,
    detail: false,
    layoutNoCurrent: 0,
    layouts: {
      'grid-hierarchical': 'Gitter',
      'list-hierarchical': 'Liste'
    }
  },
  showBlank: true,
  slideNoOld: null,
  slideNoCurrent: null,
  slides: {}
}

const getters = {
  folderTitleTree: state => {
    return state.folderTitleTree
  },
  presentation: state => {
    return state.presentation
  },
  previewSize: state => {
    return state.preview.size
  },
  previewDetail: state => {
    return state.preview.detail
  },
  previewLayoutNoCurrent: state => {
    return state.preview.layoutNoCurrent
  },
  previewLayoutCurrent: (state, getters) => {
    const layoutKeys = Object.keys(getters.previewLayouts)
    const layoutKey = layoutKeys[state.preview.layoutNoCurrent]
    return {
      id: layoutKey,
      title: getters.previewLayouts[layoutKey]
    }
  },
  previewLayouts: state => {
    return state.preview.layouts
  },
  slideNoCurrent: state => {
    return state.slideNoCurrent
  },
  slideCurrent: (state, getters) => {
    if (state.slideNoCurrent) {
      return getters.slideByNo(state.slideNoCurrent)
    }
  },
  slideOld: (state, getters) => {
    if (state.slideNoOld) {
      return getters.slideByNo(state.slideNoOld)
    }
  },
  slideByNo: state => no => {
    return state.slides[no - 1]
  },
  slides: (state, getters) => {
    if (state.slides.length > 0) {
      return state.slides
    }
  },
  slidesCount: (state, getters) => {
    return getters.slides.length
  },
  showBlank: (state) => {
    return state.showBlank
  }
}

const actions = {
  async openPresentation ({ commit, dispatch }, { rawYamlString, mongoDbObject }) {
    const presentation = new Presentation()
    await presentation.parseYamlFile(rawYamlString)
    if (mongoDbObject) {
      presentation.mergeFromMongo(mongoDbObject)
    }
    commit('setPresentation', presentation)
    commit('setSlides', presentation.slides)
    dispatch('setSlideNoCurrent', 1)
  },
  async openPresentationById ({ dispatch }, id) {
    // Get the path
    let response = await vue.$media.httpRequest.request({
      url: 'query',
      method: 'get',
      params: {
        type: 'presentations',
        method: 'exactMatch',
        field: 'id',
        search: id
      }
    })
    if (!response.data) {
      throw new Error(`Unkown presentation with the id “${id}”`)
    }
    const mongoDbObject = response.data
    // Get yaml content as a string of the presentation.
    response = await vue.$media.httpRequest.request({
      url: `/media/${mongoDbObject.path}`,
      headers: { 'Cache-Control': 'no-cache' },
    })
    const rawYamlString = response.data
    await dispatch('openPresentation', { rawYamlString, mongoDbObject })
  },
  async reloadPresentation ({ dispatch, getters }) {
    const pres = getters.presentation
    if ('meta' in pres && 'id' in pres.meta) {
      await dispatch('openPresentationById', pres.meta.id)
    }
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
    let newProps = newSlide.renderData.props

    if (getters.slideCurrent) {
      oldSlide = getters.slideCurrent
      commit('setSlideNoOld', oldSlide.no)
      oldProps = oldSlide.renderData.props
      getters.slideCurrent.master.beforeLeaveSlide(
        { oldSlide, oldProps, newSlide, newProps },
        customStore.vueMasterInstanceCurrent
      )
    }
    commit('setShowBlank', true)
    commit('setSlideNoCurrent', no)
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
    const thisArg = customStore.vueMasterInstanceCurrent
    slideCurrent.master.leaveStep({ oldStepNo, newStepNo }, thisArg)
    commit('setStepNoCurrent', { slideCurrent, stepNoCurrent })
    slideCurrent.master.enterStep({ oldStepNo, newStepNo }, thisArg)
  },
  async updateFolderTitleTree ( { commit } ) {
    const response = await vue.$media.httpRequest.request({
      url: 'get/folder-title-tree',
      method: 'get',
      headers: { 'Cache-Control': 'no-cache' },
      params: {
        timestamp: new Date().getTime()
      }
    })
    commit('setFolderTitleTree', response.data)
  },
  increasePreviewSize ({ commit, getters }) {
    commit('previewSize', getters.previewSize + 0.1)
  },
  decreasePreviewSize ({ commit, getters }) {
    commit('previewSize', getters.previewSize - 0.1)
  },
  switchPreviewDetail ({ commit, getters }) {
    commit('previewDetail', !getters.previewDetail)
  },
  switchPreviewLayout ({ commit, getters }) {
    const no = getters.previewLayoutNoCurrent
    const layoutCount = Object.keys(getters.previewLayouts).length
    if (layoutCount === no + 1) {
      commit('previewLayoutNoCurrent', 0)
    } else {
      commit('previewLayoutNoCurrent', no + 1)
    }
  }
}

const mutations = {
  previewDetail (state, value) {
    state.preview.detail = value
  },
  previewLayoutNoCurrent (state, value) {
    state.preview.layoutNoCurrent = value
  },
  previewSize (state, value) {
    state.preview.size = value
  },
  setFolderTitleTree (state, tree) {
    Vue.set(state, 'folderTitleTree', tree)
  },
  setSlides (state, slides) {
    Vue.set(state, 'slides', slides)
  },
  setSlideNoOld (state, slideNoOld) {
    state.slideNoOld = parseInt(slideNoOld)
  },
  setSlideNoCurrent (state, slideNoCurrent) {
    state.slideNoCurrent = parseInt(slideNoCurrent)
  },
  setStepNoCurrent (state, { slideCurrent, stepNoCurrent }) {
    slideCurrent.renderData.stepNoCurrent = stepNoCurrent
  },
  setPresentation (state, presentation) {
    Vue.set(state, 'presentation', presentation)
  },
  setShowBlank (state, showBlank) {
    Vue.set(state, 'showBlank', showBlank)
  }
}

export default new Vuex.Store({
  modules: {
    presentation: {
      namespaced: true,
      state,
      getters,
      actions,
      mutations
    }
  }
})
