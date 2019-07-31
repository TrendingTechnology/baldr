class InitState {
  constructor () {
    this.gradeNameCurrent = null
    this.seatNoCurrent = null
    this.showModal = false
  }
}

const state = new InitState()

const getters = {
  gradeNameCurrent: (state) => {
    return state.gradeNameCurrent
  },
  showModal: (state) => {
    return state.showModal
  },
  seatNoCurrent: (state) => {
    return state.seatNoCurrent
  }
}

const actions = {
  showModal: ({ commit }) => {
    commit('setShowModal', true)
  },
  closeModal: ({ commit }) => {
    commit('setShowModal', false)
  }
}

const mutations = {
  flushAppState: (state) => {
    const cleanState = new InitState()
    for (const property in cleanState) {
      state[property] = cleanState[property]
    }
  },
  setGradeNameCurrent: (state, gradeName) => {
    state.gradeNameCurrent = gradeName
  },
  setSeatNoCurrent: (state, seatNo) => {
    state.seatNoCurrent = seatNo
  },
  setShowModal: (state, status) => {
    state.showModal = status
  }
}

export default {
  InitState,
  state,
  getters,
  actions,
  mutations
}
