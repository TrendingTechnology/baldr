import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  mediaDevices: []
}

const getters = {
  mediaDevices: state => {
    return state.mediaDevices
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
  }
}

const actions = {
  async setMediaDevices ({ commit }) {
    navigator.mediaDevices.enumerateDevices()
    commit('setMediaDevices', await navigator.mediaDevices.enumerateDevices())
  }
}

const mutations = {
  setMediaDevices (state, mediaDevices) {
    state.mediaDevices = mediaDevices
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
