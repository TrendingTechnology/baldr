import Vue from 'vue'

const state = {
}

const getters = {
  getPersonByGradeAndSeatNo: (state, getters) => (grade, seatNo) => {
    if (state.hasOwnProperty(grade) && state[grade].hasOwnProperty(seatNo)) {
      return state[grade][seatNo]
    }
    return false
  },
  getPersonByCurrentGradeAndSeatNo: (state, getters) => (seatNo) => {
    return getters.getPersonByGradeAndSeatNo(getters.getCurrentGrade, seatNo)
  }
}

const actions = {
  removePersonFromPlan: ({ commit, getters }, { personId, seatNo }) => {
    let person = getters.getPersonById(personId)
    let seat = getters.getSeatByNo(seatNo)
    commit('removePersonFromPlan', { person, seat })
  }
}

const mutations = {
  addPersonToPlan: (state, { person, seatNo }) => {
    if (!state.hasOwnProperty(person.grade)) {
      Vue.set(state, person.grade, {})
    }
    Vue.set(state[person.grade], seatNo, person)
  },
  removePersonFromPlan: (state, { person, seat }) => {
    Vue.delete(state[person.grade], seat.no)
    person.seatNo = 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
