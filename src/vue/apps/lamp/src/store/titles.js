import Vue from 'vue'

import vm from '@/main'

const state = {
  rootTreeList: null,
  subTreeList: null,
  relPath: null
}

const getters = {
  subTreeList: state => {
    return state.subTreeList
  },
  rootTreeList: state => {
    return state.rootTreeList
  }
}

const actions = {
  async loadRootTreeList ({ commit }) {
    const response = await vm.$media.httpRequest.request({
      url: 'get/folder-title-tree',
      method: 'get',
      headers: { 'Cache-Control': 'no-cache' },
      params: {
        timestamp: new Date().getTime()
      }
    })
    const root = {
      'musik': {
        sub: response.data,
        folder: {
          title: 'Fach Musik',
          level: 0,
          hasPresentation: false,
          relPath: 'musik',
          folderName: 'musik'
        }
      }
    }
    commit('setRootTreeList', root)
    commit('setSubTreeList', root)
  },
  setSubTreeList({ commit, getters }, relPath) {
    if (relPath == null || relPath === 'Musik') {
      return
    }
    const folderNames = ['musik', ...relPath.split('/')]
    let list = getters.rootTreeList
    for (const folderName of folderNames) {
      if (list != null && list[folderName] != null) {
        list = list[folderName].sub
      }
    }
    commit('setRelPath', relPath)
    commit('setSubTreeList', list)
  }
}

const mutations = {
  setRootTreeList (state, list) {
    Vue.set(state, 'rootTreeList', list)
  },
  setSubTreeList (state, list) {
    Vue.set(state, 'subTreeList', list)
  },
  setRelPath (state, relPath) {
    Vue.set(state, 'relPath', relPath)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
