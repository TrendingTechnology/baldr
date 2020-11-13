const state = {
  size: 0.6,
  detail: false,
  hierarchical: false,
  layoutNoCurrent: 0,
  layouts: {
    grid: 'Gitter',
    list: 'Liste'
  }
}

const getters = {
  size: state => {
    return state.size
  },
  detail: state => {
    return state.detail
  },
  hierarchical: state => {
    return state.hierarchical
  },
  layoutNoCurrent: state => {
    return state.layoutNoCurrent
  },
  layoutCurrent: (state, getters) => {
    const layoutKeys = Object.keys(getters.layouts)
    const layoutKey = layoutKeys[getters.layoutNoCurrent]
    return {
      id: layoutKey,
      title: getters.layouts[layoutKey]
    }
  },
  layouts: state => {
    return state.layouts
  }
}

const actions = {
  increaseSize ({ commit, getters }) {
    commit('size', getters.size + 0.1)
  },
  decreaseSize ({ commit, getters }) {
    commit('size', getters.size - 0.1)
  },
  switchDetail ({ commit, getters }) {
    commit('detail', !getters.detail)
  },
  switchHierarchical ({ commit, getters }) {
    commit('hierarchical', !getters.hierarchical)
  },
  switchLayout ({ commit, getters }) {
    const no = getters.layoutNoCurrent
    const layoutCount = Object.keys(getters.layouts).length
    if (layoutCount === no + 1) {
      commit('layoutNoCurrent', 0)
    } else {
      commit('layoutNoCurrent', no + 1)
    }
  }
}

const mutations = {
  detail (state, value) {
    state.detail = value
  },
  hierarchical (state, value) {
    state.hierarchical = value
  },
  layoutNoCurrent (state, value) {
    state.layoutNoCurrent = value
  },
  size (state, value) {
    state.size = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
