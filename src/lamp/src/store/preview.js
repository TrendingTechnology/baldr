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
  preview: state => {
    return state.preview.size
  },
  previewSize: state => {
    return state.preview.size
  },
  previewDetail: state => {
    return state.preview.detail
  },
  previewHierarchical: state => {
    return state.preview.hierarchical
  },
  previewLayoutNoCurrent: state => {
    return state.preview.layoutNoCurrent
  },
  previewLayoutCurrent: (state, getters) => {
    const layoutKeys = Object.keys(getters.previewLayouts)
    const layoutKey = layoutKeys[state.preview.layoutNoCurrent]
    return {
      id: layoutKey,
      title: getters.previewLayouts[layoutKey]
    }
  },
  previewLayouts: state => {
    return state.preview.layouts
  }
}

const actions = {
  increasePreviewSize ({ commit, getters }) {
    commit('previewSize', getters.previewSize + 0.1)
  },
  decreasePreviewSize ({ commit, getters }) {
    commit('previewSize', getters.previewSize - 0.1)
  },
  switchPreviewDetail ({ commit, getters }) {
    commit('previewDetail', !getters.previewDetail)
  },
  switchPreviewHierarchical ({ commit, getters }) {
    commit('previewHierarchical', !getters.previewHierarchical)
  },
  switchPreviewLayout ({ commit, getters }) {
    const no = getters.previewLayoutNoCurrent
    const layoutCount = Object.keys(getters.previewLayouts).length
    if (layoutCount === no + 1) {
      commit('previewLayoutNoCurrent', 0)
    } else {
      commit('previewLayoutNoCurrent', no + 1)
    }
  }
}

const mutations = {
  previewDetail (state, value) {
    state.preview.detail = value
  },
  previewHierarchical (state, value) {
    state.preview.hierarchical = value
  },
  previewLayoutNoCurrent (state, value) {
    state.preview.layoutNoCurrent = value
  },
  previewSize (state, value) {
    state.preview.size = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
