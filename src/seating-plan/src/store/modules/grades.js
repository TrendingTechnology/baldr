import Vue from 'vue'

class Grade {
  constructor (name) {
    this.name = name
    this.personsCount = 0
    this.personsPlacedCount = 0
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
    if (state.hasOwnProperty(name)) {
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
  currentPersonsCount: (state, get) => {
    const grade = get.grade(get.currentGrade)
    return grade.personsCount
  },
  jobsOfGrade: (state, get) => (gradeName) => {
    const grade = get.grade(gradeName)
    if (grade.hasOwnProperty('jobs')) {
      return grade.jobs
    }
    return {}
  },
  jobsOfCurrentGrade: (state, get) => {
    return get.jobsOfGrade(get.currentGrade)
  },
  /**
   * Indicate if all persons in a grade are having a seat and are places.
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
  hasPersonJob: (state, get) => (personId, jobName) => {
    if (!personId) {
      return false
    }
    const grade = get.currentGradeObject
    return grade.hasOwnProperty('jobs') &&
      grade.jobs.hasOwnProperty(jobName) &&
      grade.jobs[jobName].hasOwnProperty(personId)
  },
  getJobsOfPerson: (state, get) => (person) => {
    const grade = get.gradeOfPerson(person)
    const jobNames = []
    if (grade.hasOwnProperty('jobs')) {
      for (const [jobName, persons] of Object.entries(grade.jobs)) {
        for (const [personId, person] of Object.entries(persons)) {
          if (person.id === personId) {
            jobNames.push(jobName)
          }
        }
      }
    }
    return jobNames
  }
}

const actions = {
  addGrade: ({ commit, getters }, name) => {
    if (!getters.grade(name)) {
      const grade = new Grade(name)
      commit('addGrade', grade)
    }
  },
  deleteGrade: ({ commit, getters }, gradeName) => {
    const persons = getters.personsByGrade(gradeName)
    for (const person of persons) {
      commit('deletePerson', person)
    }
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
  }
}

const mutations = {
  addGrade: (state, grade) => {
    Vue.set(state, grade.name, grade)
  },
  deleteGrade: (state, gradeName) => {
    Vue.delete(state, gradeName)
  },
  incrementPersonsCount: (state, gradeName) => {
    state[gradeName].personsCount += 1
  },
  decrementPersonsCount: (state, gradeName) => {
    state[gradeName].personsCount -= 1
  },
  incrementPersonsPlacedCount: (state, gradeName) => {
    state[gradeName].personsPlacedCount += 1
  },
  decrementPersonsPlacedCount: (state, gradeName) => {
    state[gradeName].personsPlacedCount -= 1
  },
  addPersonToJob: (state, { grade, person, job }) => {
    if (!grade.hasOwnProperty('jobs')) Vue.set(grade, 'jobs', {})
    if (!grade.jobs.hasOwnProperty(job.name)) Vue.set(grade.jobs, job.name, {})
    if (!grade.jobs[job.name].hasOwnProperty(person.id)) {
      Vue.set(grade.jobs[job.name], person.id, person)
    }
  },
  removePersonFromJob: (state, { grade, person, job }) => {
    Vue.delete(grade.jobs[job.name], person.id)
    if (Object.keys(grade.jobs[job.name]).length === 0) {
      Vue.delete(grade.jobs, job.name)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
