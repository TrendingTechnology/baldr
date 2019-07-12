import Vue from 'vue'

class Grade {
  constructor (name) {
    this.name = name
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
    const persons = get.personsByGradeAsObject(gradeName)
    return Object.keys(persons).length
  },
  currentPersonsCount: (state, get) => {
    return get.personsCount(get.currentGrade)
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
    if (persons) {
      for (const person of persons) {
        commit('deletePerson', person)
      }
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
  incrementPersonsPlacedCount: (state, gradeName) => {
    state[gradeName].personsPlacedCount += 1
  },
  decrementPersonsPlacedCount: (state, gradeName) => {
    state[gradeName].personsPlacedCount -= 1
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
