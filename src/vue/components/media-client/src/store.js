/**
 * @module @bldr/media-client/store
 */

/* globals config */

import Vue from 'vue'

import * as resolver from '@bldr/media-resolver'
import { makeHttpRequestInstance } from '@bldr/http-request'

const httpRequest = makeHttpRequestInstance(config, 'automatic', '/api/media')

const state = {
  multiPartUris: new Set(),
  multiPartSelections: {},
  assets: {},
  assetsNg: {},
  uuidToId: {},
  playList: [],
  playListNoCurrent: null,
  restApiServers: [],
  samples: {},
  samplesNg: {},
  // To realize a playthrough and stop option on the audio and video master
  // slides, we must track the currently playing sample and the in the future
  // to be played sample (loaded).
  sampleLoaded: null,
  samplePlaying: null,
  shortcutCounter: {
    audio: 1,
    video: 1,
    image: 1
  }
}

const getters = {
  assetByUri: (state, getters) => uri => {
    // asset URI is specifed as a sample
    if (uri.indexOf('#') > -1) uri = uri.replace(/#.*$/, '')
    if (uri.indexOf('uuid:') === 0) uri = getters.idByUuid(uri)
    return getters.assets[uri]
  },
  assetNgByUri: (state, getters) => uri => {
    const ref = resolver.translateToAssetRef(uri)
    if (ref != null) {
      return getters.assetsNg[ref]
    }
  },
  assets: state => {
    return state.assets
  },
  assetsNg: state => {
    return state.assetsNg
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
    resolver.getMultipartSelection(uri)
    if (uri.indexOf('uuid:') === 0) uri = getters.idByUuid(uri)
    return state.multiPartSelections[uri]
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
  samplesNg: state => {
    return state.samplesNg
  },
  samplePlaying: state => {
    return state.samplePlaying
  },
  sampleByUri: (state, getters) => uri => {
    if (!uri) return
    const samples = getters.samples
    if (uri.indexOf('#') === -1) uri = `${uri}#complete`
    if (uri.indexOf('uuid:') === 0) uri = getters.idByUuid(uri)
    return samples[uri]
  },
  sampleNgByUri: (state, getters) => uri => {
    if (!uri) return
    const samplesNg = getters.samplesNg
    const ref = resolver.translateToSampleRef(uri)
    return samplesNg[ref]
  },
  samplePlayListCurrent: (state, getters) => {
    return getters.samples[getters.playList[getters.playListNoCurrent - 1]]
  },
  shortcutCounterByType: state => type => {
    return state.shortcutCounter[type]
  }
}

const actions = {
  addAsset ({ commit, dispatch }, asset) {
    commit('addAsset', asset)
    // for (const sampleUri in asset.samples) {
    //   dispatch('addSampleToPlayList', asset.samples[sampleUri])
    // }
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
    commit('clearMultiPartUris')
    commit('setSampleLoaded', null)
    commit('setSamplePlaying', null)
    commit('setPlayListNoCurrent', null)
    commit('resetShortcutCounter')
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
  addMultiPartUri (state, multiPartUri) {
    state.multiPartUris.add(multiPartUri)
  },
  addMultiPartSelection (state, selection) {
    Vue.set(state.multiPartSelections, selection.uriRef, selection)
    Vue.set(state.uuidToId, selection.uriUuid, selection.uriRef)
  },
  clearMultiPartUris (state) {
    state.multiPartUris.clear()
  },
  addAsset (state, asset) {
    Vue.set(state.assets, asset.uriRef, asset)
    Vue.set(state.uuidToId, asset.uriUuid, asset.uriRef)
  },
  addAssetNg (state, asset) {
    Vue.set(state.assetsNg, asset.ref, asset)
  },
  addSample (state, sample) {
    Vue.set(state.samples, sample.uriRef, sample)
    Vue.set(state.uuidToId, sample.uriUuid, sample.uriRef)
  },
  addSampleNg (state, sample) {
    Vue.set(state.samplesNg, sample.ref, sample)
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
  resetShortcutCounter (state) {
    state.shortcutCounter.audio = 1
    state.shortcutCounter.video = 1
    state.shortcutCounter.image = 1
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
