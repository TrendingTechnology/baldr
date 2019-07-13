import Vue from 'vue'

const state = {
}

const getters = {
  plans: (state) => state,
  personByGradeAndSeatNo: (state) => (grade, seatNo) => {
    if ({}.hasOwnProperty.call(state, grade) && {}.hasOwnProperty.call(state[grade], seatNo)) {
      return state[grade][seatNo]
    }
    return false
  },
  personByCurrentGradeAndSeatNo: (state, get) => (seatNo) => {
    const gradeName = get.currentGrade
    const persons = get.personsByGradeAsObject(gradeName)
    for (const personName in persons) {
      const person = persons[personName]
      if (seatNo === person.seatNo) return person
    }
    return {}
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
  },
  removePersonFromPlanWithoutSeatNo: ({ commit, getters }, person) => {
    const plans = getters.plans
    if ({}.hasOwnProperty.call(plans, person.grade)) {
      const gradePlan = plans[person.grade]
      for (const [seatNo, personInPlan] of Object.entries(gradePlan)) {
        if (arePersonsEqual(personInPlan, person)) {
          const seat = getters.seatByNo(seatNo)
          commit('removePersonFromPlan', { person, seat })
          return
        }
      }
    }
  }
}

const mutations = {
  addPersonToPlan: (state, { person, seatNo }) => {
    if (!{}.hasOwnProperty.call(state, person.grade)) {
      Vue.set(state, person.grade, {})
    }
    Vue.set(state[person.grade], seatNo, person)
    // person.seatNo = seatNo
  },
  removePersonFromPlan: (state, { person, seat }) => {
    if ({}.hasOwnProperty.call(state, person.grade)) {
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
