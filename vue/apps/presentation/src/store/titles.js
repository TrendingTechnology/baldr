import Vue from 'vue'

import * as api from '@bldr/api-wrapper'

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
  },
  relPath: state => {
    return state.relPath
  },
  titleOfRelPath: (state, getters) => {
    if (getters.relPath == null || getters.relPath === '/') {
      return 'Alle Themen'
    }
    const folderNames = getters.relPath.split('/')
    let list = getters.rootTreeList
    let folder
    for (const folderName of folderNames) {
      if (list != null && list[folderName] != null) {
        folder = list[folderName].folder
        list = list[folderName].sub
      }
    }
    return folder.title
  }
}

const actions = {
  async loadRootTreeList ({ commit }) {
    const tree = await api.getTitleTree()
    commit('setRootTreeList', tree)
    commit('setSubTreeList', tree)
  },
  setSubTreeList ({ commit, getters }, relPath) {
    if (relPath == null) {
      commit('setRelPath', '/')
      commit('setSubTreeList', getters.rootTreeList)
      return
    }
    const folderNames = relPath.split('/')
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
