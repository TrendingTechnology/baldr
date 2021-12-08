class InitState {
  constructor () {
    this.gradeNameCurrent = null
    this.seatNoCurrent = null
  }
}

const state = new InitState()

const getters = {
  gradeNameCurrent: state => {
    return state.gradeNameCurrent
  },
  seatNoCurrent: state => {
    return state.seatNoCurrent
  }
}

const mutations = {
  flushAppState: state => {
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
  }
}

export default {
  InitState,
  state,
  getters,
  mutations
}
