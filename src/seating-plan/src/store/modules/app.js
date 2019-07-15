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
  seatNoCurrent: (state) => {
    return state.seatNoCurrent
  },
  modalState: (state) => {
    return state.showModal
  }
}

const actions = {
  showModal: ({ commit }) => {
    commit('setModal', true)
  },
  closeModal: ({ commit }) => {
    commit('setModal', false)
  }
}

const mutations = {
  flushAppState: (state) => {
    const cleanState = new InitState()
    for (const property in cleanState) {
      state[property] = cleanState[property]
    }
  },
  setCurrentGrade: (state, gradeName) => {
    state.gradeNameCurrent = gradeName
  },
  setCurrentSeat: (state, seatNo) => {
    state.seatNoCurrent = seatNo
  },
  setModal: (state, open) => {
    state.showModal = open
  }
}

export default {
  InitState,
  state,
  getters,
  actions,
  mutations
}
