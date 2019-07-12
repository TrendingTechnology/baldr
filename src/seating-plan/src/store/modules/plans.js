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

function arePersonsEqual (personA, personB) {
  if (personA.firstName === personB.firstName &&
      personA.lastName === personB.lastName &&
      personA.grade === personB.grade) {
    return true
  }
  return false
}

const actions = {
  removePersonFromPlan: ({ commit, getters }, { personId, seatNo }) => {
    const person = getters.personById(personId)
    const seat = getters.seatByNo(seatNo)
    commit('removePersonFromPlan', { person, seat })
    commit('decrementPersonsPlacedCount', person.grade)
  },
  removePersonFromPlanWithoutSeatNo: ({ commit, getters }, person) => {
    const plans = getters.plans
    if (plans.hasOwnProperty(person.grade)) {
      const gradePlan = plans[person.grade]
      for (const [seatNo, personInPlan] of Object.entries(gradePlan)) {
        if (arePersonsEqual(personInPlan, person)) {
          const seat = getters.seatByNo(seatNo)
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
