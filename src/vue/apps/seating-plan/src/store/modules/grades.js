/**
 * Sort alphabetically
 */

import Vue from 'vue'

class Grade {
  constructor (name) {
    this.name = name
    this.persons = {}
  }

  toJSON () {
    return this.persons
  }
}

export class Person {
  constructor (firstName, lastName, grade, seatNo = 0, jobs = []) {
    this.firstName = firstName.trim()
    this.lastName = lastName.trim()
    this.grade = grade.trim()
    this.seatNo = seatNo
    this.jobs = jobs
  }

  get name () {
    return `${this.lastName}, ${this.firstName}`
  }

  get id () {
    return `${this.grade}: ${this.lastName}, ${this.firstName}`
  }

  toJSON () {
    const json = {
      // firstName: this.firstName,
      // lastName: this.lastName,
      // grade: this.grade
    }
    if (this.seatNo) json.seatNo = this.seatNo
    if (this.jobs.length) json.jobs = this.jobs
    return json
  }

  splitName (name) {
    const segments = name.split(', ')
    return {
      firstName: segments[1],
      lastName: segments[0]
    }
  }
}

/**
 * @see {@link https://stackoverflow.com/a/38641281}
 */
function naturalSort (a, b) {
  return a.localeCompare(b, 'de', { numeric: true, sensitivity: 'base' })
}

const state = {}

const getters = {
  grade: state => gradeName => {
    if ({}.hasOwnProperty.call(state, gradeName)) {
      return state[gradeName]
    }
    return false
  },
  gradeCurrent: (state, getters) => {
    const gradeName = getters.gradeNameCurrent
    if (gradeName) {
      return getters.grade(gradeName)
    }
  },
  gradeNames: state => {
    const gradeNames = Object.keys(state)
    return gradeNames.sort(naturalSort)
  },
  gradeOfPerson: (state, getters) => person => {
    return getters.grade(person.grade)
  },
  hasPersonJob: (state, getters) => (personId, jobName) => {
    if (!personId) {
      return false
    }
    const person = getters.personById(personId)
    return person.jobs.includes(jobName)
  },
  isGradePlaced: (state, getters) => gradeName => {
    if (
      getters.personsCount(gradeName) === getters.personsPlacedCount(gradeName)
    ) {
      return true
    }
    return false
  },
  isGradePlacedCurrent: (state, getters) => {
    return getters.isGradePlaced(getters.gradeNameCurrent)
  },
  jobsOfGrade: (state, getters) => gradeName => {
    const persons = getters.personsByGrade(gradeName)
    const jobs = {}
    for (const [personName, person] of Object.entries(persons)) {
      if (person.jobs) {
        for (const jobName of person.jobs) {
          if (!{}.hasOwnProperty.call(jobs, jobName)) {
            jobs[jobName] = {}
          }
          jobs[jobName][personName] = person
        }
      }
    }
    return jobs
  },
  jobsOfGradeCurrent: (state, getters) => {
    return getters.jobsOfGrade(getters.gradeNameCurrent)
  },
  jobsOfPerson: (state, getters) => person => {
    return person.jobs
  },
  person: state => ({ firstName, lastName, grade }) => {
    const name = `${lastName}, ${firstName}`
    if (
      {}.hasOwnProperty.call(state, grade) &&
      {}.hasOwnProperty.call(state[grade].persons, name)
    ) {
      return state[grade].persons[name]
    }
    return false
  },
  personByGradeAndSeatNo: (state, getters) => (gradeName, seatNo) => {
    const persons = getters.personsByGrade(gradeName)
    for (const personName in persons) {
      const person = persons[personName]
      if (seatNo === person.seatNo) return person
    }
    return false
  },
  personByGradeAndSeatNoCurrent: (state, getters) => seatNo => {
    const gradeName = getters.gradeNameCurrent
    return getters.personByGradeAndSeatNo(gradeName, seatNo)
  },
  personById: (state, getters) => personId => {
    const match = personId.match(/(.+): (.+), (.+)/)
    return getters.person({
      firstName: match[3],
      lastName: match[2],
      grade: match[1]
    })
  },
  personsByGrade: state => gradeName => {
    if ({}.hasOwnProperty.call(state, gradeName)) {
      return state[gradeName].persons
    }
    return {}
  },
  personsByGradeAsListSortedCurrent: (state, getters) => {
    const persons = getters.personsByGrade(getters.gradeNameCurrent)
    const out = []
    if (persons) {
      for (const name of Object.keys(persons).sort()) {
        out.push(persons[name])
      }
      return out
    }
    return []
  },
  personsByGradeCurrent: (state, getters) => {
    return getters.personsByGrade(getters.gradeNameCurrent)
  },
  personsCount: (state, getters) => gradeName => {
    const persons = getters.personsByGrade(gradeName)
    return Object.keys(persons).length
  },
  personsCountCurrent: (state, getters) => {
    return getters.personsCount(getters.gradeNameCurrent)
  },
  personsPlacedCount: (state, getters) => gradeName => {
    const persons = getters.personsByGrade(gradeName)
    let count = 0
    for (const personName in persons) {
      if (persons[personName].seatNo) {
        count += 1
      }
    }
    return count
  },
  personsPlacedCountCurrent: (state, getters) => {
    return getters.personsPlacedCount(getters.gradeNameCurrent)
  }
}

/**
 * Naming convention:
 *
 * CRUD:
 * - create
 * - delete
 */
const actions = {
  addJobToPerson: ({ commit, getters }, { personId, jobName }) => {
    if (!getters.hasPersonJob(personId, jobName)) {
      const person = getters.personById(personId)
      const job = getters.jobByName(jobName)
      commit('addJobToPerson', { person, job })
    }
  },
  createGrade: ({ commit, getters }, gradeName) => {
    if (!getters.grade(gradeName)) {
      const grade = new Grade(gradeName)
      commit('createGrade', grade)
    }
  },
  createPerson: (
    { commit, getters, dispatch },
    { firstName, lastName, grade, seatNo, jobs }
  ) => {
    if (!getters.person({ firstName, lastName, grade })) {
      const person = new Person(firstName, lastName, grade, seatNo, jobs)
      dispatch('createGrade', person.grade)
      commit('createPerson', person)
    }
  },
  deleteGrade: ({ commit }, gradeName) => {
    commit('deleteGrade', gradeName)
  },
  deletePerson: ({ commit }, person) => {
    commit('deletePerson', person)
  },
  importGradesState: ({ dispatch, commit }, newState) => {
    commit('flushGradesState')
    for (const gradeName in newState) {
      for (const personName in newState[gradeName]) {
        const name = Person.prototype.splitName(personName)
        const person = newState[gradeName][personName]
        dispatch('createPerson', {
          firstName: name.firstName,
          lastName: name.lastName,
          grade: gradeName,
          seatNo: person.seatNo,
          jobs: person.jobs
        })
      }
    }
  },
  placePerson: ({ commit, getters }, { seatNo, personId }) => {
    const oldPerson = getters.personByGradeAndSeatNoCurrent(seatNo)
    const newPerson = getters.personById(personId)

    // Drag the same placed person over the same seat
    if (oldPerson && oldPerson.id === newPerson.id) {
      return
    }

    if (oldPerson) {
      commit('unplacePerson', { person: oldPerson })
    }

    // Move the same person to another seat. Free the previously taken seat.
    if (newPerson.seatNo) {
      commit('unplacePerson', { person: newPerson })
    }

    // Place the person.
    commit('placePerson', { person: newPerson, seatNo: seatNo })
  },
  removeJobFromPerson: ({ commit, getters }, { personId, jobName }) => {
    const person = getters.personById(personId)
    const job = getters.jobByName(jobName)
    commit('removeJobFromPerson', { person, job })
  },
  unplacePerson: ({ commit, getters }, { personId, seatNo }) => {
    const person = getters.personById(personId)
    const seat = getters.seatByNo(seatNo)
    commit('unplacePerson', { person, seat })
  }
}

/**
 * Naming convention:
 *
 * CRUD:
 * - create
 * - delete
 */
const mutations = {
  addJobToPerson: (state, { person, job }) => {
    person.jobs.push(job.name)
  },
  createGrade: (state, grade) => {
    Vue.set(state, grade.name, grade)
  },
  createPerson: (state, person) => {
    Vue.set(state[person.grade].persons, person.name, person)
  },
  deleteGrade: (state, gradeName) => {
    Vue.delete(state, gradeName)
  },
  deletePerson: (state, person) => {
    Vue.delete(state[person.grade].persons, person.name)
  },
  flushGradesState: state => {
    for (const property of Object.keys(state)) {
      delete state[property]
    }
  },
  placePerson: (state, { person, seatNo }) => {
    person.seatNo = seatNo
  },
  removeJobFromPerson: (state, { person, job }) => {
    for (let i = 0; i < person.jobs.length; i++) {
      if (person.jobs[i] === job.name) {
        person.jobs.splice(i, 1)
        break
      }
    }
  },
  renameGrade: (state, { oldGradeName, newGradeName }) => {
    if (oldGradeName === newGradeName || !newGradeName) return
    const persons = state[oldGradeName].persons
    for (const personName in persons) {
      persons[personName].grade = newGradeName
    }
    Vue.set(state, newGradeName, state[oldGradeName])
    Vue.delete(state, oldGradeName)
  },
  renamePerson: (state, { person, newFirstName, newLastName }) => {
    const oldName = person.name
    if (newFirstName) person.firstName = newFirstName
    if (newLastName) person.lastName = newLastName
    const newName = person.name
    if (oldName === newName) return
    Vue.set(state[person.grade].persons, newName, person)
    Vue.delete(state[person.grade].persons, oldName)
  },
  unplacePerson: (state, { person }) => {
    person.seatNo = 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
