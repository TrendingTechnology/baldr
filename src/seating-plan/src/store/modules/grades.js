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
  grade: (state) => (name) => {
    if ({}.hasOwnProperty.call(state, name)) {
      return state[name]
    }
    return false
  },
  gradeOfPerson: (state, get) => (person) => {
    return get.grade(person.grade)
  },
  gradeNames: (state) => {
    const gradeNames = Object.keys(state)
    return gradeNames.sort(naturalSort)
  },
  currentGradeObject: (state, get) => {
    const gradeName = get.currentGrade
    if (gradeName) {
      return get.grade(gradeName)
    }
  },
  personsCount: (state, get) => (gradeName) => {
    const persons = get.personsByGrade(gradeName)
    return Object.keys(persons).length
  },
  currentPersonsCount: (state, get) => {
    return get.personsCount(get.currentGrade)
  },
  personsPlacedCount: (state, get) => (gradeName) => {
    const persons = get.personsByGrade(gradeName)
    let count = 0
    for (const personName in persons) {
      if (persons[personName].seatNo) {
        count += 1
      }
    }
    return count
  },
  currentPersonsPlacedCount: (state, get) => {
    return get.personsPlacedCount(get.currentGrade)
  },
  jobsOfGrade: (state, get) => (gradeName) => {
    const persons = get.personsByGrade(gradeName)
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
  jobsOfCurrentGrade: (state, get) => {
    return get.jobsOfGrade(get.currentGrade)
  },
  /**
   * Indicate if all persons in a grade are having a seat and are placed.
   *
   * @returns boolean
   */
  isGradePlaced: (state, get) => {
    const grade = get.currentGradeObject
    if (grade && grade.personsCount === grade.personsPlacedCount) {
      return true
    }
    return false
  },
  /**
   * Indicate if all persons in a grade are having a seat and are placed.
   *
   * @returns boolean
   */
  isGradePlacedCurrent: (state, get) => {
    const grade = get.currentGradeObject
    if (grade && get.personsCount(grade.name) === get.personsPlacedCount(grade.name)) {
      return true
    }
    return false
  },
  hasPersonJob: (state, get) => (personId, jobName) => {
    if (!personId) {
      return false
    }
    const person = get.personById(personId)
    return person.jobs.includes(jobName)
  },
  jobsOfPerson: (state, get) => (person) => {
    return person.jobs
  },
  person: (state) => ({ firstName, lastName, grade }) => {
    const name = `${lastName}, ${firstName}`
    if ({}.hasOwnProperty.call(state, grade) &&
        {}.hasOwnProperty.call(state[grade].persons, name)) {
      return state[grade].persons[name]
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
    if ({}.hasOwnProperty.call(state, gradeName)) {
      return state[gradeName].persons
    }
    return {}
  },
  personsByGradeAsListSortedCurrent: (state, get) => {
    const persons = get.personsByGrade(get.currentGrade)
    const out = []
    if (persons) {
      for (const name of Object.keys(persons).sort()) {
        out.push(persons[name])
      }
      return out
    }
    return []
  },
  personsByCurrentGrade: (state, get) => {
    return get.personsByGrade(get.currentGrade)
  },
  personByGradeAndSeatNo: (state, get) => (gradeName, seatNo) => {
    const persons = get.personsByGrade(gradeName)
    for (const personName in persons) {
      const person = persons[personName]
      if (seatNo === person.seatNo) return person
    }
    return {}
  },
  personByCurrentGradeAndSeatNo: (state, get) => (seatNo) => {
    const gradeName = get.currentGrade
    return get.personByGradeAndSeatNo(gradeName, seatNo)
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
  createPerson: ({ commit, getters, dispatch }, { firstName, lastName, grade, seatNo, jobs }) => {
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
    const oldPerson = getters.personByCurrentGradeAndSeatNo(seatNo)
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
  flushGradesState: (state) => {
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
