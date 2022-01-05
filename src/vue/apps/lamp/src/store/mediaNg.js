/**
 * @module @bldr/media-client/store
 */

/* globals config */

import Vue from 'vue'

import { resolver } from '@bldr/presentation-parser'

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
    return resolver.getAsset(uri)
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
    return resolver.getSample(uri)
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
    resolver.reset()
  },
  incrementShortcutCounterByType ({ commit, getters }, type) {
    const counter = getters.shortcutCounterByType(type) + 1
    commit('setShortcutCounterByType', {
      type,
      counter
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
