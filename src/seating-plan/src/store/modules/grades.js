import Vue from 'vue'

class Grade {
  constructor (name) {
    this.name = name
    this.personsCount = 0
    this.personsPlacedCount = 0
  }
}

const state = {}

const getters = {
  getGrade: (state) => (name) => {
    if (state.hasOwnProperty(name)) {
      return state[name]
    }
    return false
  }
}

const actions = {
  addGrade: ({ commit, getters }, name) => {
    if (!getters.getGrade(name)) {
      let grade = new Grade(name)
      commit('addGrade', grade)
    }
  }
}

const mutations = {
  addGrade: (state, grade) => {
    Vue.set(state, grade.name, grade)
  },
  incrementPersonsCount: (state, gradeName) => {
    state[gradeName].personsCount += 1
  },
  incrementPersonsPlacedCount: (state, gradeName) => {
    state[gradeName].personsPlacedCount += 1
  },
  decrementPersonsPlacedCount: (state, gradeName) => {
    state[gradeName].personsPlacedCount -= 1
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
