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
      commit('incrementPersons', grade, { root: true })
    }
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
