/**
 * @module @bldr/lamp/store/recent
 */

/**
 * @typedef {Object} presInfo
 * @property {String} presRef
 * @property {String} title
 */

const state = []

const getters = {
  recent: (state) => {
    return state
  }
}

const actions = {
  readFromLocalStorage ({ commit }) {
    const recent = localStorage.getItem('recentPresentations')
    if (recent && Array.isArray(recent)) {
      commit('write', JSON.parse(recent))
    }
  },
  add ({ commit, getters }, { presRef, title }) {
    let recent
    if (getters.recent) {
      recent = [...getters.recent]
    } else {
      recent = []
    }
    let latestPres
    if (recent.length) latestPres = recent[0]
    if (!latestPres || (presRef !== latestPres.presRef)) {
      const presInfo = {
        presRef
      }
      if (!title) {
        presInfo.title = presRef
      } else {
        presInfo.title = title
      }
      recent.unshift(presInfo)
      if (recent.length > 10) recent.pop()
      commit('write', recent)
    }
  }
}

const mutations = {
  write (state, recent) {
    localStorage.setItem('recentPresentations', JSON.stringify(recent))
    while (state.length > 0) {
      state.pop()
    }
    for (const presInfo of recent) {
      state.push(presInfo)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
