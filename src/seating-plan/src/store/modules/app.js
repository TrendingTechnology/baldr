class InitState {
  constructor () {
    this.gradeNameCurrent = null
    this.importInProgress = true
    this.seatNoCurrent = null
    this.showModal = false
    this.stateChanged = false
  }
}

const state = new InitState()

const getters = {
  gradeNameCurrent: (state) => {
    return state.gradeNameCurrent
  },
  importInProgress: (state) => {
    return state.importInProgress
  },
  showModal: (state) => {
    return state.showModal
  },
  seatNoCurrent: (state) => {
    return state.seatNoCurrent
  },
  stateChanged: (state) => {
    return state.stateChanged
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
  setImportInProgress: (state, status) => {
    state.importInProgress = status
  },
  setSeatNoCurrent: (state, seatNo) => {
    state.seatNoCurrent = seatNo
  },
  setShowModal: (state, status) => {
    state.showModal = status
  },
  setStateChanged: (state, status) => {
    state.stateChanged = status
  }
}

export default {
  InitState,
  state,
  getters,
  actions,
  mutations
}
