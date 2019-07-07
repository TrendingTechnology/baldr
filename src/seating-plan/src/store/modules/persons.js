import Vue from 'vue'

class Person {
  constructor (firstName, lastName, grade) {
    this.firstName = firstName
    this.lastName = lastName
    this.grade = grade
    this.seatNo = 0
    this.placed = false
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
  getPerson: (state) => ({ firstName, lastName, grade }) => {
    if (state.hasOwnProperty(grade) &&
    state[grade].hasOwnProperty(lastName) &&
    state[grade][lastName].hasOwnProperty(firstName)) {
      return state[grade][lastName][firstName]
    }
    return false
  },
  getPersonById: (state, getters) => (personId) => {
    let match = personId.match(/(.+): (.+), (.+)/)
    return getters.getPerson({
      firstName: match[3],
      lastName: match[2],
      grade: match[1]
    })
  },
  getPersonsByGrade: (state) => (grade) => {
    let persons = []
    for (let lastName of Object.keys(state[grade]).sort()) {
      for (let firstName of Object.keys(state[grade][lastName]).sort()) {
        persons.push(state[grade][lastName][firstName])
      }
    }
    return persons
  },
  getPersonsByCurrentGrade: (state, getters) => {
    return getters.getPersonsByGrade(getters.getCurrentGrade)
  }
}

const actions = {
  addPerson ({ commit, getters, dispatch }, { firstName, lastName, grade }) {
    if (!getters.getPerson({ firstName, lastName, grade })) {
      let person = new Person(firstName, lastName, grade)
      commit('addPerson', person)
      dispatch('addGrade', grade, { root: true })
      commit('incrementPersonsCount', grade, { root: true })
    }
  },
  placePersonById ({ commit, getters }, { seatNo, personId }) {
    let plan = this.data.plans[this.data.currentGrade]
    let person = this.getPersonById(personId)
    let grade = this.getCurrentGrade()
    // Replace a already placed person and remove it from the plan.
    let replacedPersonId = plan[seatNo]

    // Drag the same placed person over the same seat
    if (replacedPersonId === person.id) {
      return
    }

    if (replacedPersonId) {
      let replacedPerson = this.getPersonById(replacedPersonId)
      replacedPerson.seatNo = 0
    }
    // Update placed counter
    // Decrease counter when one person is dragged over another person.
    if (replacedPersonId && person.seatNo) {
      this.data.grades[grade].placed -= 1 // TODO: remove
      commit('decrementPersonsPlacedCounter', null, { root: true })
    // Increase placed counter only if person had not yet a seat.
    // and whom doesn’t replace a person.
    } else if (!replacedPersonId && !person.seatNo) {
      this.data.grades[grade].placed += 1 // TODO: remove
      commit('incrementPersonsPlacedCounter', null, { root: true })
    }

    // Move the same person to another seat. Free the previously taken seat.
    if (person.seatNo) {
      plan[person.seatNo] = ''
    }

    // Place the person.
    plan[seatNo] = personId
    person.seatNo = seatNo
  }
}

const mutations = {
  addPerson (state, person) {
    // grade
    if (!state.hasOwnProperty(person.grade)) {
      Vue.set(state, person.grade, {})
    }
    // lastName
    if (!state[person.grade].hasOwnProperty(person.lastName)) {
      Vue.set(state[person.grade], person.lastName, {})
    }
    Vue.set(state[person.grade][person.lastName], person.firstName, person)
  },
  placePersonById (seatNo, personId) {
    let plan = this.data.plans[this.data.currentGrade]
    let person = this.getPersonById(personId)
    let grade = this.getCurrentGrade()
    // Replace a already placed person and remove it from the plan.
    let replacedPersonId = plan[seatNo]

    // Drag the same placed person over the same seat
    if (replacedPersonId === person.id) {
      return
    }

    if (replacedPersonId) {
      let replacedPerson = this.getPersonById(replacedPersonId)
      replacedPerson.seatNo = 0
    }
    // Update placed counter
    // Decrease counter when one person is dragged over another person.
    if (replacedPersonId && person.seatNo) {
      this.data.grades[grade].placed -= 1
    // Increase placed counter only if person had not yet a seat.
    // and whom doesn’t replace a person.
    } else if (!replacedPersonId && !person.seatNo) {
      this.data.grades[grade].placed += 1
    }

    // Move the same person to another seat. Free the previously taken seat.
    if (person.seatNo) {
      plan[person.seatNo] = ''
    }

    // Place the person.
    plan[seatNo] = personId
    person.seatNo = seatNo
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
