/**
 * @module @bldr/media-client/store
 */

/* globals config */

import Vue from 'vue'

import * as mediaResolver from '@bldr/media-resolver'

const state = {
  assets: {},
  playList: [],
  playListNoCurrent: null,
  samples: {},
  // To realize a playthrough and stop option on the audio and video master
  // slides, we must track the currently playing sample and the in the future
  // to be played sample (loaded).
  sampleLoaded: null,
  samplePlaying: null
}

const getters = {
  assetByUri: (state, getters) => uri => {
    const ref = mediaResolver.translateToAssetRef(uri)
    if (ref != null) {
      return getters.assets[ref]
    }
  },
  assets: state => {
    return state.assets
  },
  httpUrlByUri: (state, getters) => uri => {
    const media = getters.assets
    if (uri in media) {
      return media[uri].httpUrl
    }
    return null
  },
  isMedia: (state, getters) => {
    return Object.keys(getters.assets).length > 0
  },
  multiPartSelectionByUri: state => uri => {
    return mediaResolver.getMultipartSelection(uri)
  },
  playList: state => {
    return state.playList
  },
  playListNoCurrent: state => {
    return state.playListNoCurrent
  },
  sampleLoaded: state => {
    return state.sampleLoaded
  },
  samples: state => {
    return state.samples
  },
  samplePlaying: state => {
    return state.samplePlaying
  },
  sampleByUri: (state, getters) => uri => {
    if (!uri) return
    const ref = mediaResolver.translateToSampleRef(uri)
    return getters.samples[ref]
  },
  samplePlayListCurrent: (state, getters) => {
    return getters.samples[getters.playList[getters.playListNoCurrent - 1]]
  }
}

const actions = {
  addAsset ({ commit, getters }, asset) {
    commit('addAsset', asset)
  },
  addSampleToPlayList ({ commit, getters }, sample) {
    const list = getters.playList
    if (!list.includes(sample.uri) && sample.asset.type !== 'image') {
      commit('addSampleToPlayList', sample)
    }
  },
  clear ({ dispatch, commit }) {
    dispatch('removeAssetsAll')
    commit('setSampleLoaded', null)
    commit('setSamplePlaying', null)
    commit('setPlayListNoCurrent', null)
    mediaResolver.resetMediaCache()
  },
  incrementShortcutCounterByType ({ commit, getters }, type) {
    const counter = getters.shortcutCounterByType(type) + 1
    commit('setShortcutCounterByType', {
      type, counter
    })
  },
  removeAsset ({ commit }, asset) {
    for (const sampleRef in asset.samples) {
      commit('removeSample', sampleRef)
      commit('removeSampleFromPlayList', sampleRef)
    }
    commit('removeAsset', asset.ref)
  },
  removeAssetsAll ({ dispatch, getters }) {
    for (const assetUri in getters.assets) {
      dispatch('removeAsset', getters.assets[assetUri])
    }
  },
  setPlayListSampleCurrent ({ commit, getters }, sample) {
    let no = null
    if (sample) {
      no = getters.playList.indexOf(sample.uri) + 1
    }
    commit('setPlayListNoCurrent', no)
  },
  setPlayListSampleNext ({ commit, getters }) {
    const no = getters.playListNoCurrent
    const count = getters.playList.length
    if (no === count) {
      commit('setPlayListNoCurrent', 1)
    } else {
      commit('setPlayListNoCurrent', no + 1)
    }
  },
  setPlayListSamplePrevious ({ commit, getters }) {
    const no = getters.playListNoCurrent
    const count = getters.playList.length
    if (no === 1) {
      commit('setPlayListNoCurrent', count)
    } else {
      commit('setPlayListNoCurrent', no - 1)
    }
  },
  setSamplePlaying ({ commit, dispatch }, sample) {
    commit('setSamplePlaying', sample)
    if (sample) dispatch('setPlayListSampleCurrent', sample)
  }
}

const mutations = {
  addMultiPartSelection (state, selection) {
    Vue.set(state.multiPartSelections, selection.uriRef, selection)
  },
  addAsset (state, asset) {
    if (state.assets[asset.ref] == null) {
      Vue.set(state.assets, asset.ref, asset)
    }
  },
  addSample (state, sample) {
    if (state.samples[sample.ref] == null) {
      Vue.set(state.samples, sample.ref, sample)
    }
  },
  addSampleToPlayList (state, sample) {
    state.playList.push(sample.uriRef)
  },
  removeAsset (state, uri) {
    Vue.delete(state.assets, uri)
  },
  removeSample (state, uri) {
    Vue.delete(state.samples, uri)
  },
  removeSampleFromPlayList (state, uri) {
    while (state.playList.indexOf(uri) > -1) {
      const index = state.playList.indexOf(uri)
      if (index > -1) {
        state.playList.splice(index, 1)
      }
    }
  },
  setPlayListNoCurrent (state, no) {
    state.playListNoCurrent = no
  },
  setSampleLoaded (state, sample) {
    state.sampleLoaded = sample
  },
  setSamplePlaying (state, sample) {
    state.samplePlaying = sample
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
