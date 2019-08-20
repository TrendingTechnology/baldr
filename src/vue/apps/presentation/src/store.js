import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  mediaDevices: []
}

const getters = {
  mediaDevices: state => {
    return state.mediaDevices
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
