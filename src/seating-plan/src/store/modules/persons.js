import Vue from 'vue'

export class Person {
  constructor (firstName, lastName, grade) {
    this.firstName = firstName.trim()
    this.lastName = lastName.trim()
    this.grade = grade.trim()
    this.seatNo = 0
  }

  get name () {
    return `${this.lastName}, ${this.firstName}`
  }

  get id () {
    return `${this.grade}: ${this.lastName}, ${this.firstName}`
  }

  toJSON () {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      grade: this.grade
    }
  }
}

const state = {}

const getters = {
  person: (state) => ({ firstName, lastName, grade }) => {
    const name = `${lastName}, ${firstName}`
    if ({}.hasOwnProperty.call(state, grade) &&
        {}.hasOwnProperty.call(state[grade], name)) {
      return state[grade][name]
    }
    return false
  },
  personById: (state, get) => (personId) => {
    const match = personId.match(/(.+): (.+), (.+)/)
    return get.person({
      firstName: match[3],
      lastName: match[2],
      grade: match[1]
    })
  },
  personsByGrade: (state) => (gradeName) => {
    const persons = []
    if ({}.hasOwnProperty.call(state, gradeName)) {
      for (const name of Object.keys(state[gradeName]).sort()) {
        persons.push(state[gradeName][name])
      }
      return persons
    }
    return []
  },
  personsByGradeAsObject: (state) => (gradeName) => {
    if ({}.hasOwnProperty.call(state, gradeName)) {
      return state[gradeName]
    }
    return {}
  },
  personsByCurrentGrade: (state, get) => {
    return get.personsByGrade(get.currentGrade)
  }
}

const actions = {
  addPerson: ({ commit, getters, dispatch }, { firstName, lastName, grade }) => {
    if (!getters.person({ firstName, lastName, grade })) {
      const person = new Person(firstName, lastName, grade)
      commit('addPerson', person)
      dispatch('addGrade', grade)
      commit('incrementPersonsCount', grade)
    }
  },
  deletePerson: ({ commit, dispatch, getters }, person) => {
    dispatch('removePersonFromPlanWithoutSeatNo', person)
    const jobs = getters.getJobsOfPerson(person)
    for (const jobName of jobs) {
      dispatch('removePersonFromJob', { personId: person.id, jobName })
    }
    commit('decrementPersonsCount', person.grade)
    commit('deletePerson', person)
  },
  placePersonById: ({ commit, getters }, { seatNo, personId }) => {
    const oldPerson = getters.personByCurrentGradeAndSeatNo(seatNo)
    const newPerson = getters.personById(personId)
    const gradeName = newPerson.grade

    // Drag the same placed person over the same seat
    if (oldPerson && oldPerson.id === newPerson.id) {
      return
    }

    if (oldPerson) {
      commit('resetPersonsSeatNo', oldPerson)
    }
    // Update placed counter
    // Decrease counter when one person is dragged over another person.
    if (oldPerson && newPerson.seatNo) {
      commit('decrementPersonsPlacedCount', gradeName)
    // Increase placed counter only if person had not yet a seat.
    // and whom doesn’t replace a person.
    } else if (!oldPerson && !newPerson.seatNo) {
      commit('incrementPersonsPlacedCount', gradeName)
    }

    // Move the same person to another seat. Free the previously taken seat.
    if (newPerson.seatNo) {
      const seat = getters.seatByNo(newPerson.seatNo)
      commit('removePersonFromPlan', { person: newPerson, seat: seat })
    }

    // Place the person.
    commit('addPersonToPlan', { person: newPerson, seatNo: seatNo })
    commit('setPersonsSeatNo', { person: newPerson, seatNo: seatNo })
  }
}

const mutations = {
  addPerson: (state, person) => {
    // grade
    if (!{}.hasOwnProperty.call(state, person.grade)) {
      Vue.set(state, person.grade, {})
    }
    Vue.set(state[person.grade], person.name, person)
  },
  deletePerson: (state, person) => {
    Vue.delete(state[person.grade], person.name)
    if (!Object.keys(state[person.grade]).length) {
      Vue.delete(state, person.grade)
    }
  },
  setPersonsSeatNo: (state, { person, seatNo }) => {
    person.seatNo = seatNo
  },
  resetPersonsSeatNo: (state, person) => {
    person.seatNo = 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
