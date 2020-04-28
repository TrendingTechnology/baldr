/**
 * @module @bldr/vue-plugin-media/store
 */

import Vue from 'vue'

import { getDefaultServers, HttpRequest } from '@bldr/http-request'
const httpRequest = new HttpRequest(getDefaultServers(), '/api/media')

const state = {
  multiPartUris: new Set(),
  multiPartSelections: {},
  mediaFiles: {},
  playList: [],
  playListNoCurrent: null,
  assetTypes: {
    audio: {},
    video: {},
    image: {}
  },
  restApiServers: [],
  samples: {},
  // To realize a playthrough and stop option on the audio and video master
  // slides, we must track the currently playing sample and the in the future
  // to be played sample (loaded).
  sampleLoaded: null,
  samplePlaying: null
}

const getters = {
  samplePlayListCurrent: (state, getters) => {
    return getters.samples[getters.playList[getters.playListNoCurrent - 1]]
  },
  httpUrlByUri: (state, getters) => uri => {
    const media = getters.mediaFiles
    if (uri in media) {
      return media[uri].httpUrl
    }
    return null
  },
  isMedia: (state, getters) => {
    return Object.keys(getters.mediaFiles).length > 0
  },
  mediaFileByUri: (state, getters) => uri => {
    // mediaFile URI is specifed as a sample
    if (uri.indexOf('#') > -1) uri = uri.replace(/#.*$/, '')
    const media = getters.mediaFiles
    if (uri in media) {
      return media[uri]
    }
    return null
  },
  mediaFiles: state => {
    return state.mediaFiles
  },
  mediaFilesByType: state => type => {
    return state.assetTypes[type]
  },
  multiPartSelectionByUri: state => uri => {
    return state.multiPartSelections[uri]
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
    const samples = getters.samples
    if (uri.indexOf('#') === -1) uri = `${uri}#complete`
    if (uri in samples) {
      return samples[uri]
    }
  },
  typeCount: state => type => {
    return Object.keys(state.assetTypes[type]).length
  }
}

const actions = {
  addMediaFile ({ commit, dispatch }, mediaFile) {
    commit('addMediaFile', mediaFile)
    commit('addMediaFileToTypes', mediaFile)
    for (const sampleUri in mediaFile.samples) {
      dispatch('addSampleToPlayList', mediaFile.samples[sampleUri])
    }
  },
  addSampleToPlayList ({ commit, getters }, sample) {
    const list = getters.playList
    if (!list.includes(sample.uri) && sample.mediaFile.type !== 'image') {
      commit('addSampleToPlayList', sample)
    }
  },
  clear ({ dispatch, commit }) {
    dispatch('removeMediaFilesAll')
    commit('clearMultiPartUris')
    commit('setSampleLoaded', null)
    commit('setSamplePlaying', null)
    commit('setPlayListNoCurrent', null)
  },
  removeMediaFile ({ commit, getters }, mediaFile) {
    for (const sampleUri in mediaFile.samples) {
      const sample = mediaFile.samples[sampleUri]
      commit('removeSample', sample)
      commit('removeSampleFromPlayList', sample)
    }
    commit('removeMediaFileFromTypes', mediaFile)
    commit('removeMediaFile', mediaFile)
  },
  removeMediaFilesAll ({ dispatch, getters }) {
    for (const mediaFileUri in getters.mediaFiles) {
      dispatch('removeMediaFile', getters.mediaFiles[mediaFileUri])
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
    const versions = await httpRequest.request('version', 'all')
    const counts = await httpRequest.request('stats/count', 'all')
    const updates = await httpRequest.request('stats/updates', 'all')

    const result = []
    for (const endpointName in servers) {
      result.push({
        name: servers[endpointName].name,
        baseUrl: servers[endpointName].baseUrl,
        version: versions[endpointName].data.version,
        count: counts[endpointName].data,
        update: updates[endpointName].data[0].begin,
        commitId: updates[endpointName].data[0].lastCommitId
      })
    }
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
  clearMultiPartUris (state) {
    state.multiPartUris.clear()
  },
  addMediaFile (state, mediaFile) {
    Vue.set(state.mediaFiles, mediaFile.uri, mediaFile)
  },
  addMediaFileToTypes (state, mediaFile) {
    Vue.set(state.assetTypes[mediaFile.type], mediaFile.uri, mediaFile)
  },
  addSample (state, sample) {
    Vue.set(state.samples, sample.uri, sample)
  },
  addSampleToPlayList (state, sample) {
    state.playList.push(sample.uri)
  },
  removeMediaFile (state, mediaFile) {
    Vue.delete(state.mediaFiles, mediaFile.uri)
  },
  removeMediaFileFromTypes (state, mediaFile) {
    Vue.delete(state.assetTypes[mediaFile.type], mediaFile.uri)
  },
  removeSample (state, sample) {
    Vue.delete(state.samples, sample.uri)
  },
  addMultiPartSelection (state, selection) {
    Vue.set(state.multiPartSelections, selection.uri, selection)
  },
  removeSampleFromPlayList (state, sample) {
    while (state.playList.indexOf(sample.uri) > -1) {
      const index = state.playList.indexOf(sample.uri)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
