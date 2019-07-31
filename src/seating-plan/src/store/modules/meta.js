class InitState {
  constructor () {
    this.location = ''
    this.year = ''
    this.teacher = ''
  }
}

const state = new InitState()

const getters = {
  meta: (state) => (key) => {
    return state[key]
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
