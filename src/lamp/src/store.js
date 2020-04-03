/**
 * vuex store
 *
 * @module @bldr/lamp/store
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { Presentation } from './content-file'
import vue, { customStore } from '@/main.js'

Vue.use(Vuex)

const state = {
  folderTitleTree: null,
  presentation: {},
  preview: {
    size: 0.6,
    detail: false,
    hierarchical: false,
    layoutNoCurrent: 0,
    layouts: {
      grid: 'Gitter',
      list: 'Liste'
    }
  },
  showBlank: true,
  slideNoOld: null,
  slideNo: null,
  slides: {},
  showMetaDataOverlay: false
}

const getters = {
  folderTitleTree: state => {
    return state.folderTitleTree
  },
  presentation: state => {
    if (state.presentation.slides) return state.presentation
  },
  preview: state => {
    return state.preview.size
  },
  previewSize: state => {
    return state.preview.size
  },
  previewDetail: state => {
    return state.preview.detail
  },
  previewHierarchical: state => {
    return state.preview.hierarchical
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
  slideNo: state => {
    return state.slideNo
  },
  slide: (state, getters) => {
    if (state.slideNo) {
      return getters.slideByNo(state.slideNo)
    }
  },
  slideNoOld: (state) => {
    return state.slideNoOld
  },
  slideOld: (state, getters) => {
    if (getters.slideNoOld) {
      return getters.slideByNo(getters.slideNoOld)
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
    if (!getters.slides) return
    return getters.slides.length
  },
  showBlank: (state) => {
    return state.showBlank
  },
  showMetaDataOverlay: (state) => {
    return state.showMetaDataOverlay
  },
  stepNo: (state, getters) => {
    return getters.slide.stepNo
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
      headers: { 'Cache-Control': 'no-cache' }
    })
    const rawYamlString = response.data
    await dispatch('openPresentation', { rawYamlString, mongoDbObject })
  },
  /**
   * Relaod the presentation and switch to the current slide (the same slide no)
   * again.
   */
  async reloadPresentation ({ dispatch, getters }) {
    const no = getters.slide.no
    const pres = getters.presentation
    if ('meta' in pres && 'id' in pres.meta) {
      await dispatch('openPresentationById', pres.meta.id)
      dispatch('setSlideNoCurrent', no)
    }
  },
  /**
   * @param {Object} vuex - see Vuex documentation
   * @param {Number} direction - `1`: next, `-1`: previous
   */
  setSlideNextOrPrevious ({ dispatch, getters }, direction) {
    const no = getters.slideNo
    const count = getters.slidesCount
    // next
    if (direction === 1 && no === count) {
      dispatch('setSlideNoCurrent', 1)
    // previous
    } else if (direction === -1 && no === 1) {
      dispatch('setSlideNoCurrent', count)
    } else {
      dispatch('setSlideNoCurrent', no + direction)
    }
  },
  /**
   * If the direction is next (1) set the step number to 1. If the direction
   * is previous (-1), set the step number to the last step = step count.
   *
   * @param {Object} vuex - see Vuex documentation
   * @param {Number} direction - `1`: next, `-1`: previous
   */
  setStepLastOrFirstByDirection ({ dispatch, getters }, direction) {
    // We need a new current slide.
    // Only set the step number on slides with step support. The master slide
    // cloze sets the variable stepCount async. If you enter a never before
    // visited cloze slide backwards, strange things happens.
    if (getters.slide.stepCount) {
      let stepNo = 1
      if (direction === -1) {
        stepNo = getters.slide.stepCount
      }
      dispatch('setStepNoCurrent', {
        slide: getters.slide,
        stepNo
      })
    }
  },
  /**
   * Know issues. previous to a not yet visited note master with steps: the
   * first step is shown instead of the last.
   *
   * @param {Object} vuex - see Vuex documentation
   * @param {Number} direction - `1`: next, `-1`: previous
   */
  setSlideOrStepNextOrPrevious ({ dispatch, getters }, direction) {
    // Change only steps
    if (
      getters.slide.stepCount > 1 &&
      (
        (direction === 1 && getters.slide.stepNo !== getters.slide.stepCount) || // Next
        (direction === -1 && getters.slide.stepNo !== 1) // Previous
      )
    ) {
      dispatch('setStepNextOrPrevious', direction)
    // Change slide and steps
    } else {
      dispatch('setSlideNextOrPrevious', direction)
      dispatch('setStepLastOrFirstByDirection', direction)
    }
  },
  setSlideNoToOld ({ dispatch, getters }) {
    const slideNoOld = getters.slideNoOld
    if (slideNoOld) dispatch('setSlideNoCurrent', slideNoOld)
  },
  setSlideNoCurrent ({ commit, getters }, no) {
    let oldSlide
    let oldProps
    const newSlide = getters.slideByNo(no)
    const newProps = newSlide.props

    if (getters.slide) {
      oldSlide = getters.slide
      commit('setSlideNoOld', oldSlide.no)
      oldProps = oldSlide.props
      getters.slide.master.beforeLeaveSlide(
        { oldSlide, oldProps, newSlide, newProps },
        customStore.vueMasterInstanceCurrent
      )
    }
    commit('setShowBlank', true)
    commit('setSlideNoCurrent', no)
  },
  /**
   * @param {Object} vuex - see Vuex documentation
   * @param {Number} direction - `1`: next, `-1`: previous
   */
  setStepNextOrPrevious ({ dispatch, getters }, direction) {
    const slide = getters.slide
    if (!slide) return
    const count = slide.stepCount
    if (!count) return
    let stepNo
    const no = slide.stepNo
    // Next
    if (direction === 1 && no === count) {
      stepNo = 1
    // Previous
    } else if (direction === -1 && no === 1) {
      stepNo = count
    } else {
      stepNo = no + direction
    }
    dispatch('setStepNoCurrent', { slide, stepNo })
  },
  setStepNoCurrent ({ commit }, { slide, stepNo }) {
    const oldStepNo = slide.stepNo
    const newStepNo = stepNo
    const thisArg = customStore.vueMasterInstanceCurrent
    slide.master.leaveStep({ oldStepNo, newStepNo }, thisArg)
    commit('setStepNoCurrent', { slide, stepNo })
    slide.master.enterStep({ oldStepNo, newStepNo }, thisArg)
  },
  setSlideAndStepNoCurrent ({ dispatch, getters }, { slideNo, stepNo }) {
    if (slideNo) dispatch('setSlideNoCurrent', slideNo)
    if (stepNo) {
      dispatch('setStepNoCurrent', { slide: getters.slide, stepNo })
    }
  },
  async updateFolderTitleTree ({ commit }) {
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
  switchPreviewHierarchical ({ commit, getters }) {
    commit('previewHierarchical', !getters.previewHierarchical)
  },
  switchPreviewLayout ({ commit, getters }) {
    const no = getters.previewLayoutNoCurrent
    const layoutCount = Object.keys(getters.previewLayouts).length
    if (layoutCount === no + 1) {
      commit('previewLayoutNoCurrent', 0)
    } else {
      commit('previewLayoutNoCurrent', no + 1)
    }
  },
  toggleMetaDataOverlay ({ commit, getters }) {
    commit('showMetaDataOverlay', !getters.showMetaDataOverlay)
  }
}

const mutations = {
  previewDetail (state, value) {
    state.preview.detail = value
  },
  previewHierarchical (state, value) {
    state.preview.hierarchical = value
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
  setSlideNoCurrent (state, slideNo) {
    state.slideNo = parseInt(slideNo)
  },
  setStepNoCurrent (state, { slide, stepNo }) {
    slide.stepNo = stepNo
  },
  setPresentation (state, presentation) {
    Vue.set(state, 'presentation', presentation)
  },
  setShowBlank (state, showBlank) {
    Vue.set(state, 'showBlank', showBlank)
  },
  showMetaDataOverlay (state, showMetaDataOverlay) {
    Vue.set(state, 'showMetaDataOverlay', showMetaDataOverlay)
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
