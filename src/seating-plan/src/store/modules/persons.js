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

const state = {
  persons: {}
}

const getters = {
  getPerson: (state) => ({ firstName, lastName, grade }) => {
    if (state.persons.hasOwnProperty(grade) &&
    state.persons[grade].hasOwnProperty(lastName) &&
    state.persons[grade][lastName].hasOwnProperty(firstName)) {
      return state.persons[grade][lastName][firstName]
    }
    return false
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
    if (!state.persons.hasOwnProperty(person.grade)) {
      Vue.set(state.persons, person.grade, {})
    }
    // lastName
    if (!state.persons[person.grade].hasOwnProperty(person.lastName)) {
      Vue.set(state.persons[person.grade], person.lastName, {})
    }
    Vue.set(state.persons[person.grade][person.lastName], person.firstName, person)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
