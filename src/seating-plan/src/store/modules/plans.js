import Vue from 'vue'

const state = {
}

const getters = {
  isPlanSet: (state) => (gradeName) => {
    return state.hasOwnProperty(gradeName)
  },
  getPersonIdByGradeAndSeatNo: (state) => (grade, seatNo) => {
    if (state.hasOwnProperty(grade) && state[grade].hasOwnProperty(seatNo)) {
      return state[grade][seatNo]
    }
    return false
  },
  getPersonIdByCurrentGradeAndSeatNo: (state, getters) => (seatNo) => {
    return getters.getPersonIdByGradeAndSeatNo(getters.getCurrentGrade, seatNo)
  }
}

const actions = {
  initPlan ({ commit, getters }, gradeName) {
    if (!getters.isPlanSet(gradeName)) {
      commit('initPlan', gradeName)
    }
  }
}

const mutations = {
  initPlan (state, gradeName) {
    Vue.set(state, gradeName, {})
    // for (let no = 1; no <= this.data.seats.count; no++) {
    //   if (!state[gradeName].hasOwnProperty(no)) {
    //     Vue.set(state[gradeName], no, '')
    //   }
    // }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
