/**
 * vuex store
 *
 * @module @bldr/lamp/store
 */

/* globals rawYamlExamples */

import Vue from 'vue'
import Vuex from 'vuex'

import * as api from '@bldr/api-wrapper'

import { Presentation } from '@/content-file.js'
import { parse as parsePresentation } from '@bldr/presentation-parser'

import vue, { customStore } from '@/main'
import nav from './nav.js'
import preview from './preview.js'
import masters from './masters.js'
import recent from './recent.js'
import titles from './titles.js'

Vue.use(Vuex)

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
  presentation: null,
  presentationNg: null,
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
  isSpeakerView: state => {
    return state.isSpeakerView
  },
  presentation: state => {
    if (state.presentation && state.presentation.slides) {
      return state.presentation
    }
  },
  presentationNg: state => {
    return state.presentationNg
  },
  slideNgByNo: state => no => {
    if (state.presentationNg != null) {
      return state.presentationNg.slides.flat[no]
    }
  },
  slideNg: (state, getters) => {
    if (state.slideNo != null) {
      return getters.slideNgByNo(state.slideNo)
    }
  },
  slideNo: state => {
    return state.slideNo
  },
  slide: (state, getters) => {
    if (state.slideNo) {
      return getters.slideByNo(state.slideNo)
    }
  },
  slideNoOld: state => {
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
  showMetaDataOverlay: state => {
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
  async openPresentation ({ commit, dispatch }, { vm, rawYamlString }) {
    const presentation = new Presentation(rawYamlString)
    const presentationNg = parsePresentation(rawYamlString)
    dispatch('recent/add', {
      presRef: presentation.ref,
      title: presentation.title
    })
    await presentation.resolveMedia(vm)
    commit('setPresentation', presentation)
    commit('setPresentationNg', presentationNg)
    commit('setSlides', presentation.slides)
    // The presentation can now be entered on each slide not only the first.
    // This is possible by the routes.
    // dispatch('setSlideNoCurrent', 1)
  },
  async openPresentationById ({ dispatch }, { vm, presRef }) {
    const mongoDbObject = await api.getPresentationByRef(presRef)

    // Get the yaml content as a string of a presentation for quick refresh
    const rawYamlString = await api.readMediaAsString(mongoDbObject.meta.path)
    await dispatch('openPresentation', { vm, rawYamlString })
  },
  /**
   * Reload the presentation and switch to the current slide (the same slide no)
   * again.
   */
  async reloadPresentation ({ dispatch, getters }) {
    const presentation = getters.presentation
    if (presentation && presentation.meta && presentation.meta.ref) {
      await dispatch('openPresentationById', {
        vm: vue,
        presRef: presentation.meta.ref
      })
      dispatch('setSlideNoCurrent', getters.slide.no)
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
  },
  increaseSlideScaleFactor ({ commit, getters }) {
    const slide = getters.slide
    if (slide != null) {
      const scaleFactor = slide.scaleFactor + 0.05
      commit('setSlideScaleFactor', { slide, scaleFactor })
    }

    const slideNg = getters.slideNg
    if (slideNg != null) {
      const scaleFactor = slideNg.scaleFactor + 0.05
      commit('setSlideNgScaleFactor', { slideNg, scaleFactor })
    }
  },
  decreaseSlideScaleFactor ({ commit, getters }) {
    const slide = getters.slide
    if (slide != null) {
      let scaleFactor = slide.scaleFactor
      if (scaleFactor > 0.1) {
        scaleFactor = scaleFactor - 0.05
      }
      commit('setSlideScaleFactor', { slide, scaleFactor })
    }

    const slideNg = getters.slideNg
    if (slideNg != null) {
      let scaleFactor = slideNg.scaleFactor
      if (scaleFactor > 0.1) {
        scaleFactor = scaleFactor - 0.05
      }
      commit('setSlideNgScaleFactor', { slideNg, scaleFactor })
    }
  },
  resetSlideScaleFactor ({ commit, getters }) {
    const slide = getters.slide
    if (slide != null) {
      commit('setSlideScaleFactor', { slide, scaleFactor: 1 })
    }

    const slideNg = getters.slideNg
    if (slideNg != null) {
      commit('setSlideNgScaleFactor', { slideNg, scaleFactor: 1 })
    }
  }
}

const mutations = {
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
    slide.stepNo = parseInt(stepNo)
  },
  setPresentation (state, presentation) {
    Vue.set(state, 'presentation', presentation)
  },
  setPresentationNg (state, presentationNg) {
    Vue.set(state, 'presentationNg', presentationNg)
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
  },
  setSlideScaleFactor (state, { slide, scaleFactor }) {
    slide.scaleFactor = scaleFactor
  },
  setSlideNgScaleFactor (state, { slideNg, scaleFactor }) {
    slideNg.scaleFactor = scaleFactor
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
        nav,
        preview,
        masters,
        recent,
        titles
      }
    }
  }
})
