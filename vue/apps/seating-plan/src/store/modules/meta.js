class InitState {
  constructor () {
    this.location = ''
    this.teacher = ''
    this.year = ''
  }
}

const state = new InitState()

const getters = {
  meta: (state) => (key) => {
    return state[key]
  },
  metaLocation: (state) => {
    return state.location
  },
  metaTeacher: (state) => {
    return state.teacher
  },
  metaYear: (state) => {
    return state.year
  }
}

const actions = {
  importMetaState: ({ commit }, newState) => {
    for (const key in newState) {
      commit('setMeta', { key: key, value: newState[key] })
    }
  }
}

const mutations = {
  setMeta: (state, { key, value }) => {
    state[key] = value
  }
}

export default {
  InitState,
  state,
  getters,
  actions,
  mutations
}
