/**
 * @module @bldr/media-client/store
 */

/* globals config */

import Vue from 'vue'

import * as mediaResolver from '@bldr/media-resolver'

const state = {
  assets: {},
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
  }
}

const actions = {
  addAsset ({ commit, getters }, asset) {
    commit('addAsset', asset)
  },
  clear ({ dispatch, commit }) {
    dispatch('removeAssetsAll')
    commit('setSampleLoaded', null)
    commit('setSamplePlaying', null)
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
    }
    commit('removeAsset', asset.ref)
  },
  removeAssetsAll ({ dispatch, getters }) {
    for (const assetUri in getters.assets) {
      dispatch('removeAsset', getters.assets[assetUri])
    }
  },
  setSamplePlaying ({ commit, dispatch }, sample) {
    commit('setSamplePlaying', sample)
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
  removeAsset (state, uri) {
    Vue.delete(state.assets, uri)
  },
  removeSample (state, uri) {
    Vue.delete(state.samples, uri)
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
