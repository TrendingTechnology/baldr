/**
 * @module @bldr/media-client/store
 */

/* globals config */

import Vue from 'vue'

import * as resolver from '@bldr/media-resolver'
import { makeHttpRequestInstance } from '@bldr/http-request'

const httpRequest = makeHttpRequestInstance(config, 'automatic', '/api/media')

const state = {
  multiPartSelections: {},
  assets: {},
  playList: [],
  playListNoCurrent: null,
  restApiServers: [],
  samples: {},
  // To realize a playthrough and stop option on the audio and video master
  // slides, we must track the currently playing sample and the in the future
  // to be played sample (loaded).
  sampleLoaded: null,
  samplePlaying: null
}

const getters = {
  assetByUri: (state, getters) => uri => {
    const ref = resolver.translateToAssetRef(uri)
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
  idByUuid: (state, getters) => uuid => {
    return state.uuidToId[uuid]
  },
  isMedia: (state, getters) => {
    return Object.keys(getters.assets).length > 0
  },
  multiPartSelectionByUri: state => uri => {
    return resolver.getMultipartSelection(uri)
  },
  multiPartSelections: state => {
    return state.multiPartSelections
  },
  multiPartUris: state => {
    return state.multiPartUris
  },
  playList: state => {
    return state.playList
  },
  playListNoCurrent: state => {
    return state.playListNoCurrent
  },
  restApiServers: state => {
    return state.restApiServers
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
    const ref = resolver.translateToSampleRef(uri)
    return getters.samples[ref]
  },
  samplePlayListCurrent: (state, getters) => {
    return getters.samples[getters.playList[getters.playListNoCurrent - 1]]
  },
  shortcutCounterByType: state => type => {
    return state.shortcutCounter[type]
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
    dispatch('removeMultiPartSelections')
    commit('setSampleLoaded', null)
    commit('setSamplePlaying', null)
    commit('setPlayListNoCurrent', null)
  },
  incrementShortcutCounterByType ({ commit, getters }, type) {
    const counter = getters.shortcutCounterByType(type) + 1
    commit('setShortcutCounterByType', {
      type, counter
    })
  },
  removeAsset ({ commit }, asset) {
    for (const sampleUri in asset.samples) {
      commit('removeSample', sampleUri)
      commit('removeSampleFromPlayList', sampleUri)
    }
    commit('removeAsset', asset.uriRef)
  },
  removeAssetsAll ({ dispatch, getters }) {
    for (const assetUri in getters.assets) {
      dispatch('removeAsset', getters.assets[assetUri])
    }
  },
  removeMultiPartSelections ({ commit, getters }) {
    for (const uri in getters.multiPartSelections) {
      commit('removeMultiPartSelection', uri)
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
  async setRestApiServers ({ commit }) {
    const versions = await httpRequest.request('version')
    const counts = await httpRequest.request('stats/count')
    const updates = await httpRequest.request('stats/updates')

    const result = []
    result.push({
      name: 'localhost',
      baseUrl: 'localhost',
      version: versions.data.version,
      count: counts.data,
      update: updates.data[0].begin,
      commitId: updates.data[0].lastCommitId
    })

    commit('setRestApiServers', result)
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
  removeMultiPartSelection (state, uri) {
    Vue.delete(state.multiPartSelections, uri)
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
  setRestApiServers (state, restApiServers) {
    Vue.set(state, 'restApiServers', restApiServers)
  },
  setSampleLoaded (state, sample) {
    state.sampleLoaded = sample
  },
  setSamplePlaying (state, sample) {
    state.samplePlaying = sample
  },
  setShortcutCounterByType (state, { type, counter }) {
    state.shortcutCounter[type] = counter
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
