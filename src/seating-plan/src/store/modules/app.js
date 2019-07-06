const state = {
  currentGrade: null,
  currentSeat: null,
  showModalPersonSelect: false
}

const getters = {
  getCurrentGrade: (state) => {
    return state.currentGrade
  }
}

const actions = {
}

const mutations = {
  setCurrentGrade: (state, gradeName) => {
    state.currentGrade = gradeName
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
