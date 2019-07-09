import Vue from 'vue'

const state = {
}

const getters = {
  plans: (state) => state,
  personByGradeAndSeatNo: (state) => (grade, seatNo) => {
    if (state.hasOwnProperty(grade) && state[grade].hasOwnProperty(seatNo)) {
      return state[grade][seatNo]
    }
    return false
  },
  personByCurrentGradeAndSeatNo: (state, get) => (seatNo) => {
    return get.personByGradeAndSeatNo(get.currentGrade, seatNo)
  }
}

const actions = {
  removePersonFromPlan: ({ commit, getters }, { personId, seatNo }) => {
    let person = getters.personById(personId)
    let seat = getters.seatByNo(seatNo)
    commit('removePersonFromPlan', { person, seat })
    commit('decrementPersonsPlacedCount', person.grade)
  },
  removePersonFromPlanWithoutSeatNo: ({ commit, getters }, person) => {
    let plans = getters.plans
    if (plans.hasOwnProperty(person.grade)) {
      let gradePlan = plans[person.grade]
      for (const [seatNo, personInPlan] of Object.entries(gradePlan)) {
        if (personInPlan === person) {
          let seat = getters.seatByNo(seatNo)
          commit('removePersonFromPlan', { person, seat })
          commit('decrementPersonsPlacedCount', person.grade)
          return
        }
      }
    }
  }
}

const mutations = {
  addPersonToPlan: (state, { person, seatNo }) => {
    if (!state.hasOwnProperty(person.grade)) {
      Vue.set(state, person.grade, {})
    }
    Vue.set(state[person.grade], seatNo, person)
    // person.seatNo = seatNo
  },
  removePersonFromPlan: (state, { person, seat }) => {
    if (state.hasOwnProperty(person.grade)) {
      Vue.delete(state[person.grade], seat.no)
      person.seatNo = 0
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
