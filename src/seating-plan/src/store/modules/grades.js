import Vue from 'vue'

class Grade {
  constructor (name) {
    this.name = name
    this.personsCount = 0
    this.personsPlaced = 0
  }
}

const state = {
  grades: {}
}

const getters = {
  getGrade: (state) => (name) => {
    if (state.grades.hasOwnProperty(name)) {
      return state.grades[name]
    }
    return false
  }
}

const actions = {
  addGrade ({ commit, getters }, name) {
    if (!getters.getGrade(name)) {
      let grade = new Grade(name)
      commit('addGrade', grade)
    }
  }
}

const mutations = {
  addGrade (state, grade) {
    Vue.set(state.grades, grade.name, grade)
  },
  incrementPersons (state, gradeName) {
    state.grades[gradeName].personsCount += 1
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
