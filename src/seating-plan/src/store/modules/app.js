const state = {
  currentGrade: null,
  currentSeat: null,
  showModal: false
}

const getters = {
  getCurrentGrade: (state) => {
    return state.currentGrade
  },
  getCurrentSeat: (state) => {
    return state.currentSeat
  },
  getModalState: (state) => {
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
  state,
  getters,
  actions,
  mutations
}
