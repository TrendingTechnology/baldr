class InitState {
  constructor () {
    this.currentGrade = null
    this.currentSeat = null
    this.showModal = false
  }
}

const state = new InitState()

const getters = {
  currentGrade: (state) => {
    return state.currentGrade
  },
  currentSeat: (state) => {
    return state.currentSeat
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
  setCurrentGrade: (state, gradeName) => {
    state.currentGrade = gradeName
  },
  setCurrentSeat: (state, seatNo) => {
    state.currentSeat = seatNo
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
