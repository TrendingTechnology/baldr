/* globals config */

import Vue from 'vue'
import Vuex from 'vuex'
import { parseContentFile } from './content-file.js'
import axios from 'axios'

const axiosInstance = axios.create({ timeout: 3000 })

Vue.use(Vuex)

const state = {
  media: {},
  mediaServerDomains: {
    restApi: '',
    httpMedia: ''
  },
  mediaDevices: [],
  slideNoCurrent: null,
  slides: {}
}

const getters = {
  media: (state) => (URL) => {
    return state.media[URL]
  },
  mediaDevices: state => {
    return state.mediaDevices
  },
  mediaServerDomains: state => {
    return state.mediaServerDomains
  },
  mediaDevicesDynamicSelect: (state, getters) => {
    const resultList = []
    for (const device of getters.mediaDevices) {
      if (device.kind === 'videoinput') {
        let label
        if (device.label) {
          label = device.label
        } else {
          label = `${device.kind} (${device.deviceId})`
        }
        resultList.push({
          id: device.deviceId,
          name: label
        })
      }
    }
    return resultList
  },
  slideNoCurrent: state => {
    return state.slideNoCurrent
  },
  slideCurrent: state => {
    if (state.slideNoCurrent) {
      return state.slides[state.slideNoCurrent]
    }
  },
  slides: state => {
    return state.slides
  },
  slidesCount: (state, getters) => {
    return Object.keys(getters.slides).length
  }
}

const actions = {
  async setMediaDevices ({ commit }) {
    commit('setMediaDevices', await navigator.mediaDevices.enumerateDevices())
  },
  setMediaServerDomains ({ commit }) {
    const conf = config.mediaServer

    axiosInstance.get(`http://${conf.domainLocal}:${conf.portRestApi}/version`)
      .then(function (response) {
        if ('version' in response.data) {
          commit('setMediaServerDomains', { type: 'restApi', ip: conf.domainLocal })
        }
      })
      .catch(function () {
        axiosInstance.get(`http://${conf.domainRemote}:${conf.portRestApi}/version`)
          .then(function (response) {
            if ('version' in response.data) {
              commit('setMediaServerDomains', { type: 'restApi', ip: conf.domainRemote })
            }
          })
      })

    axiosInstance.get(`http://${conf.domainLocal}:${conf.portHttpMedia}/robots.txt`, { crossdomain: true })
      .then(function (response) {
        if (response.data.indexOf('User-agent') > -1) {
          commit('setMediaServerDomains', { type: 'httpMedia', ip: conf.domainLocal })
        }
      })
      .catch(function () {
        axiosInstance.get(`http://${conf.domainRemote}:${conf.portHttpMedia}/robots.txt`, { crossdomain: true })
          .then(function (response) {
            if (response.data.indexOf('User-agent') > -1) {
              commit('setMediaServerDomains', { type: 'httpMedia', ip: conf.domainRemote })
            }
          })
      })
  },
  openPresentation ({ commit }, content) {
    const contentFile = parseContentFile(content)
    commit('setSlides', contentFile.slides)
    commit('setSlideNoCurrent', 1)
  },
  setSlideNext ({ commit, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.slidesCount
    if (no === count) {
      commit('setSlideNoCurrent', 1)
    } else {
      commit('setSlideNoCurrent', no + 1)
    }
  },
  setSlidePrevious ({ commit, getters }) {
    const no = getters.slideNoCurrent
    const count = getters.slidesCount
    if (no === 1) {
      commit('setSlideNoCurrent', count)
    } else {
      commit('setSlideNoCurrent', no - 1)
    }
  },
  resolveMedia ({ commit, getters }, URL) {
    const segments = URL.split(':')
    const schemeName = segments[0]
    const urlParameter = segments[1]
    const conf = config.mediaServer
    const domains = getters.mediaServerDomains
    if (schemeName === 'http' || schemeName === 'https') {
      commit('resolveMedia', { URL: URL, resolvedMedia: URL })
    } else if (schemeName === 'id') {
      axiosInstance
        .post(`http://${domains.restApi}:${conf.portRestApi}/query-by-id`, { id: urlParameter })
        .then((response) => {
          const data = response.data
          commit('resolveMedia', {
            URL: URL,
            resolvedMedia: `http://${domains.httpMedia}:${conf.portHttpMedia}/${data.path}`
          })
        })
        .catch(() => true)
    } else if (schemeName === 'filename') {
      axiosInstance
        .post(`http://${domains.restApi}:${conf.portRestApi}/query-by-filename`, { filename: urlParameter })
        .then((response) => {
          const data = response.data
          commit('resolveMedia', {
            URL: URL,
            resolvedMedia: `http://${domains.httpMedia}:${conf.portHttpMedia}/${data.path}`
          })
        })
        .catch(() => true)
    }
  }
}

const mutations = {
  resolveMedia (state, { URL, resolvedMedia }) {
    Vue.set(state.media, URL, resolvedMedia)
  },
  setMediaServerDomains (state, { type, ip }) {
    state.mediaServerDomains[type] = ip
  },
  setMediaDevices (state, mediaDevices) {
    state.mediaDevices = mediaDevices
  },
  setSlides (state, slides) {
    Vue.set(state, 'slides', slides)
  },
  setSlideNoCurrent (state, slideNoCurrent) {
    state.slideNoCurrent = parseInt(slideNoCurrent)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
