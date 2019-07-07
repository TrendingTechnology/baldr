import Vue from 'vue'

class Person {
  constructor (firstName, lastName, grade) {
    this.firstName = firstName
    this.lastName = lastName
    this.grade = grade
    this.seatNo = 0
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
    if (state.hasOwnProperty(grade) &&
    state[grade].hasOwnProperty(lastName) &&
    state[grade][lastName].hasOwnProperty(firstName)) {
      return state[grade][lastName][firstName]
    }
    return false
  },
  personById: (state, get) => (personId) => {
    let match = personId.match(/(.+): (.+), (.+)/)
    return get.person({
      firstName: match[3],
      lastName: match[2],
      grade: match[1]
    })
  },
  personsByGrade: (state) => (grade) => {
    let persons = []
    if (state.hasOwnProperty(grade)) {
      for (let lastName of Object.keys(state[grade]).sort()) {
        for (let firstName of Object.keys(state[grade][lastName]).sort()) {
          persons.push(state[grade][lastName][firstName])
        }
      }
      return persons
    }
  },
  personsByCurrentGrade: (state, get) => {
    return get.personsByGrade(get.currentGrade)
  }
}

const actions = {
  addPerson: ({ commit, getters, dispatch }, { firstName, lastName, grade }) => {
    if (!getters.person({ firstName, lastName, grade })) {
      let person = new Person(firstName, lastName, grade)
      commit('addPerson', person)
      dispatch('addGrade', grade, { root: true })
      commit('incrementPersonsCount', grade, { root: true })
    }
  },
  placePersonById: ({ commit, getters }, { seatNo, personId }) => {
    let oldPerson = getters.personByCurrentGradeAndSeatNo(seatNo)
    let newPerson = getters.personById(personId)

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
      commit('decrementPersonsPlacedCount', getters.currentGrade, { root: true })
    // Increase placed counter only if person had not yet a seat.
    // and whom doesn’t replace a person.
    } else if (!oldPerson && !newPerson.seatNo) {
      commit('incrementPersonsPlacedCount', getters.currentGrade, { root: true })
    }

    // Move the same person to another seat. Free the previously taken seat.
    if (newPerson.seatNo) {
      let seat = getters.seatByNo(newPerson.seatNo)
      commit('removePersonFromPlan', { person: newPerson, seat: seat }, { root: true })
    }

    // Place the person.
    commit('addPersonToPlan', { person: newPerson, seatNo: seatNo }, { root: true })
    commit('setPersonsSeatNo', { person: newPerson, seatNo: seatNo })
  }
}

const mutations = {
  addPerson: (state, person) => {
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
