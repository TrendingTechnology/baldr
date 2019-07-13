import Vue from 'vue'

class Grade {
  constructor (name) {
    this.name = name
    this.persons = {}
  }
}

export class Person {
  constructor (firstName, lastName, grade) {
    this.firstName = firstName.trim()
    this.lastName = lastName.trim()
    this.grade = grade.trim()
    this.seatNo = 0
    this.jobs = []
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

function arePersonsEqual (personA, personB) {
  if (personA.firstName === personB.firstName &&
      personA.lastName === personB.lastName &&
      personA.grade === personB.grade) {
    return true
  }
  return false
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
    const grade = get.grade(gradeName)
    if ({}.hasOwnProperty.call(grade, 'jobs')) {
      return grade.jobs
    }
    return {}
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
    const grade = get.currentGradeObject
    return {}.hasOwnProperty.call(grade, 'jobs') &&
      {}.hasOwnProperty.call(grade.jobs, jobName) &&
      {}.hasOwnProperty.call(grade.jobs[jobName], personId)
  },
  getJobsOfPerson: (state, get) => (person) => {
    const grade = get.gradeOfPerson(person)
    const jobNames = []
    if ({}.hasOwnProperty.call(grade, 'jobs')) {
      for (const [jobName, persons] of Object.entries(grade.jobs)) {
        for (const [personId, person] of Object.entries(persons)) {
          if (person.id === personId) {
            jobNames.push(jobName)
          }
        }
      }
    }
    return jobNames
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

const actions = {
  addGrade: ({ commit, getters }, gradeName) => {
    if (!getters.grade(gradeName)) {
      const grade = new Grade(gradeName)
      commit('addGrade', grade)
    }
  },
  deleteGrade: ({ commit, getters }, gradeName) => {
    commit('deleteGrade', gradeName)
  },
  addPersonToJob: ({ commit, getters }, { personId, jobName }) => {
    const person = getters.personById(personId)
    const grade = getters.grade(person.grade)
    const job = getters.jobByName(jobName)
    commit('addPersonToJob', { grade, person, job })
  },
  removePersonFromJob: ({ commit, getters }, { personId, jobName }) => {
    const person = getters.personById(personId)
    const grade = getters.grade(person.grade)
    const job = getters.jobByName(jobName)
    commit('removePersonFromJob', { grade, person, job })
  },
  addPerson: ({ commit, getters, dispatch }, { firstName, lastName, grade }) => {
    if (!getters.person({ firstName, lastName, grade })) {
      const person = new Person(firstName, lastName, grade)
      dispatch('addGrade', grade)
      commit('addPerson', person)
    }
  },
  deletePerson: ({ commit, dispatch, getters }, person) => {
    commit('deletePerson', person)
  },
  placePersonById: ({ commit, getters }, { seatNo, personId }) => {
    const oldPerson = getters.personByCurrentGradeAndSeatNo(seatNo)
    const newPerson = getters.personById(personId)

    // Drag the same placed person over the same seat
    if (oldPerson && oldPerson.id === newPerson.id) {
      return
    }

    // Move the same person to another seat. Free the previously taken seat.
    if (newPerson.seatNo) {
      const seat = getters.seatByNo(newPerson.seatNo)
      commit('removePersonFromPlan', { person: newPerson, seat: seat })
    }

    // Place the person.
    commit('addPersonToPlan', { person: newPerson, seatNo: seatNo })
  },
  removePersonFromPlan: ({ commit, getters }, { personId, seatNo }) => {
    const person = getters.personById(personId)
    const seat = getters.seatByNo(seatNo)
    commit('removePersonFromPlan', { person, seat })
  }
}

const mutations = {
  addGrade: (state, grade) => {
    Vue.set(state, grade.name, grade)
  },
  deleteGrade: (state, gradeName) => {
    Vue.delete(state, gradeName)
  },
  addPersonToJob: (state, { grade, person, job }) => {
    if (!{}.hasOwnProperty.call(grade, 'jobs')) Vue.set(grade, 'jobs', {})
    if (!{}.hasOwnProperty.call(grade.jobs, job.name)) Vue.set(grade.jobs, job.name, {})
    if (!{}.hasOwnProperty.call(grade.jobs[job.name], person.id)) {
      Vue.set(grade.jobs[job.name], person.id, person)
    }
  },
  removePersonFromJob: (state, { grade, person, job }) => {
    Vue.delete(grade.jobs[job.name], person.id)
    if (Object.keys(grade.jobs[job.name]).length === 0) {
      Vue.delete(grade.jobs, job.name)
    }
  },
  addPerson: (state, person) => {
    Vue.set(state[person.grade].persons, person.name, person)
  },
  deletePerson: (state, person) => {
    Vue.delete(state[person.grade].persons, person.name)
  },
  addPersonToPlan: (state, { person, seatNo }) => {
    person.seatNo = seatNo
  },
  removePersonFromPlan: (state, { person, seat }) => {
    person.seatNo = 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
