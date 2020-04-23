/**
 * vuex store
 *
 * @module @bldr/lamp/store
 */

/* globals rawYamlExamples */

import Vue from 'vue'
import Vuex from 'vuex'
import { Presentation } from './content-file'
import vue, { customStore } from '@/main.js'

Vue.use(Vuex)

/**
 * Navigation module
 *
 * Navigate through all slides and steps of an presentation. Slide numbers can
 * be labeled with an ID. To simplfy the navigation through all slides and
 * steps, we build a list of all slide and steps
 */
const nav = {
  namespaced: true,
  state: {
    /**
     * The current navigation list number. This number starts with 1.
     */
    navListNo: 1,
    /**
     * ```json
     * [
     *   { "slideNo": 1 },
     *   { "slideNo": "two" },
     *   { "slideNo": 3 },
     *   { "slideNo": 4, "stepNo": 1 },
     *   { "slideNo": 4, "stepNo": 2 },
     *   { "slideNo": 4, "stepNo": 3 },
     *   { "slideNo": 5 }
     * ]
     * ```
     *
     * @type {Array}
     */
    navList: [],
    /**
     * Each slide can be labeled with an ID. Resolve this ID to get the slide
     * number. Store all slide IDs in the instantiated objects.
     *
     * ```json
     * {
     *   "one": 1,
     *   "two": 2
     * }
     * ```
     *
     * @type {Object}
     */
    slideIds: {},
    /**
     * ```json
     * {
     *   "slide/1": 1,
     *   "slide/two": 2,
     *   "slide/16/step/1": 16,
     *   "slide/16/step/2": 17
     * }
     * ```
     *
     * @tpye {Object}
     */
    navListIndex: {}
  },
  getters: {
    /**
     *
     * @param {Object} params
     * @property {(String|Number)} slideNo - The slide number or the slide ID.
     * @property {Number} stepNo - The step number (can be unset).
     *
     * @private
     */
    indexByRouterParams: state => params => {
      if (params.stepNo) {
        return `slide/${params.slideNo}/step/${params.stepNo}`
      } else {
        return `slide/${params.slideNo}`
      }
    },
    navList: state => {
      return state.navList
    },
    navListCount: state => {
      return state.navList.length
    },
    navListIndex: state => {
      return state.navListIndex
    },
    navListNo: state => {
      return state.navListNo
    },
    /**
     *
     * @param {Object} params
     * @property {(String|Number)} slideNo - The slide number or the slide ID.
     * @property {Number} stepNo - The step number (can be unset).
     *
     * @returns {Number}
     */
    navListNoByRouterParams: (state, getters) => params => {
      const index = getters.indexByRouterParams(params)
      return state.navListIndex[index]
    },
    /**
     *
     * @param {Number} direction - `1`: next, `-1`: previous
     *
     * @returns {Number}
     */
    nextNavListNo: (state, getters) => direction => {
      const count = getters.navListCount
      const navListNo = getters.navListNo
      let no
      // Next
      if (direction === 1 && navListNo === count) {
        no = 1
      // Previous
      } else if (direction === -1 && navListNo === 1) {
        no = count
      } else {
        no = navListNo + direction
      }
      return no
    },
    /**
     * Get the router parameters for the next (or previous) slide.
     *
     * @param {Number} direction - `1`: next, `-1`: previous
     *
     * @returns {module:@bldr/lamp/content-file~routerParams}
     */
    nextRouterParams: (state, getters) => direction => {
      const no = getters.nextNavListNo(direction)
      return getters.routerParamsByNavListNo(no)
    },
    routerParamsByNavListNo: state => no => {
      return state.navList[no - 1]
    },
    slideIds: state => {
      return state.slideIds
    },
    slideNoById: (state) => slideId => {
      if (!state.slideIds[slideId]) {
        throw new Error(`Unkown slide ID “${slideId}”.`)
      }
      return state.slideIds[slideId]
    },
    /**
     * `slideNo` can be an ID. Replace this string IDs with the numeric slide
     * numbers for the Vuex store.
     *
     * @param {Object} params
     * @property {(String|Number)} slideNo - The slide number or the slide ID.
     * @property {Number} stepNo - The step number (can be unset).
     *
     * @returns {Object} paramsNormalized
     */
    slideStepNoByRouterParams: (state, getters) => params => {
      const paramsNormalized = Object.assign({}, params)
      if (state.slideIds[params.slideNo]) {
        paramsNormalized.slideNo = state.slideIds[params.slideNo]
      }
      return paramsNormalized
    }
  },
  actions: {
    initNavList ({ commit, getters }, slides) {
      // After media resolution.
      for (const slide of slides) {
        let slideNo
        if (slide.id) {
          if (this.slideIds[slide.id]) {
            throw new Error(`A slide with the id “${slide.id}” already exists.`)
          }
          commit('addSlideId', { slideId: slide.id, no: slide.no })
          slideNo = slide.id
        } else {
          slideNo = slide.no
        }
        // Generate the navigation list
        if (slide.stepCount && slide.stepCount > 1) {
          for (let index = 1; index <= slide.stepCount; index++) {
            const item = { slideNo, stepNo: index }
            commit('addNavListItem', item)
          }
        } else {
          const item = { slideNo }
          commit('addNavListItem', item)
        }
      }

      for (let i = 0; i < getters.navList.length; i++) {
        const params = getters.navList[i]
        const index = getters.indexByRouterParams(params)
        const navListNo = i + 1
        commit('addNavListIndex', { index, navListNo })
      }
    },
    /**
     * Set the current cav
     *
     * @param {Object} params -
     * @property {(String|Number)} slideNo - The slide number or the slide ID.
     * @property {Number} stepNo - The step number (can be unset).
     */
    setNavListNoByRouterParams ({ commit, getters }, params) {
      const no = getters.navListNoByRouterParams(params)
      commit('setNavListNo', no)
    }
  },
  mutations: {
    addNavListItem (state, item) {
      state.navList.push(item)
    },
    addNavListIndex (state, { index, navListNo }) {
      state.navListIndex[index] = navListNo
    },
    addSlideId (state, { slideId, no }) {
      if (state.slideIds[slideId]) {
        throw new Error(`A slide with the id “${slideId}” already exists.`)
      }
      state.slideIds[slideId] = no
    },
    setNavListNo (state, no) {
      state.navListNo = no
    }
  }
}

const state = {
  // Highlight the cursor arrows when the presentation is navigated through
  // keyboard shortcuts
  cursorArrows: {
    up: {
      triggered: false,
      timeoutId: null
    },
    right: {
      triggered: false,
      timeoutId: null
    },
    down: {
      triggered: false,
      timeoutId: null
    },
    left: {
      triggered: false,
      timeoutId: null
    }
  },
  folderTitleTree: null,
  presentation: null,
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
  slideNoOld: null,
  slideNo: null,
  slides: {},
  showMetaDataOverlay: false,
  isSpeakerView: false
}

const getters = {
  cursorArrowsStates: state => {
    return state.cursorArrows
  },
  folderTitleTree: state => {
    return state.folderTitleTree
  },
  isSpeakerView: state => {
    return state.isSpeakerView
  },
  presentation: state => {
    if (state.presentation && state.presentation.slides) return state.presentation
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
  showMetaDataOverlay: (state) => {
    return state.showMetaDataOverlay
  },
  stepNo: (state, getters) => {
    return getters.slide.stepNo
  },
  rawYamlExamples: () => {
    return rawYamlExamples
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
    // The presentation can now be entered on each slide not only the first.
    // This is possible by the routes.
    // dispatch('setSlideNoCurrent', 1)
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
      getters.slide.master.leaveSlide(
        { oldSlide, oldProps, newSlide, newProps },
        customStore.vueMasterInstanceCurrent
      )
    }

    commit('setSlideNoCurrent', no)

    newSlide.master.enterSlide(
      { oldSlide, oldProps, newSlide, newProps },
      customStore.vueMasterInstanceCurrent
    )
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
    if (!getters.slide || slideNo !== getters.slide.no) {
      dispatch('setSlideNoCurrent', slideNo)
    }
    if (stepNo !== getters.slide.stepNo) {
      dispatch('setStepNoCurrent', { slide: getters.slide, stepNo })
    }
  },
  async loadFolderTitleTree ({ commit, getters }) {
    if (!getters.folderTitleTree) {
      const response = await vue.$media.httpRequest.request({
        url: 'get/folder-title-tree'
      })
      commit('setFolderTitleTree', response.data)
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
  },
  highlightCursorArrow ({ commit, getters }, name) {
    const state = getters.cursorArrowsStates[name]
    if (state.triggered) return
    if (state.timeoutId) clearTimeout(state.timeoutId)
    commit('setCursorArrowTriggerState', { name, triggered: true })
    const timeoutId = setTimeout(() => {
      commit('setCursorArrowTriggerState', { name, triggered: false })
      commit('setCursorArrowTimeoutId', { name, timeoutId: null })
    }, 200)
    commit('setCursorArrowTimeoutId', { name, timeoutId })
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
  showMetaDataOverlay (state, showMetaDataOverlay) {
    Vue.set(state, 'showMetaDataOverlay', showMetaDataOverlay)
  },
  setCursorArrowTriggerState (state, { name, triggered }) {
    state.cursorArrows[name].triggered = triggered
  },
  setCursorArrowTimeoutId (state, { name, timeoutId }) {
    state.cursorArrows[name].timeoutId = timeoutId
  },
  setSpeakerView (state, isSpeakerView) {
    state.isSpeakerView = isSpeakerView
  }
}

export default new Vuex.Store({
  modules: {
    lamp: {
      namespaced: true,
      state,
      getters,
      actions,
      mutations,
      modules: {
        nav
      }
    }
  }
})
