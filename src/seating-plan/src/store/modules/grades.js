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
  gradeNames: (state) => {
    let gradeNames = Object.keys(state)
    return gradeNames.sort(naturalSort)
  },
  currentGradeObject: (state, get) => {
    let gradeName = get.currentGrade
    if (gradeName) {
      return get.grade(gradeName)
    }
  },
  currentPersonsCount: (state, get) => {
    let grade = get.grade(get.currentGrade)
    return grade.personsCount
  },
  jobsOfGrade: (state, get) => (gradeName) => {
    let grade = get.grade(gradeName)
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
    let grade = get.currentGradeObject
    if (grade && grade.personsCount === grade.personsPlacedCount) {
      return true
    }
    return false
  },
  hasPersonJob: (state, get) => (personId, jobName) => {
    if (!personId) {
      return false
    }
    let grade = get.currentGradeObject
    return grade.hasOwnProperty('jobs') &&
      grade.jobs.hasOwnProperty(jobName) &&
      grade.jobs[jobName].hasOwnProperty(personId)
  }
}

const actions = {
  addGrade: ({ commit, getters }, name) => {
    if (!getters.grade(name)) {
      let grade = new Grade(name)
      commit('addGrade', grade)
    }
  },
  addPersonToJob: ({ commit, getters }, { personId, jobName }) => {
    let gradeName = getters.currentGrade
    let grade = getters.grade(gradeName)
    let person = getters.personById(personId)
    let job = getters.jobByName(jobName)
    commit('addPersonToJob', { grade, person, job })
  },
  removePersonFromJob: ({ commit, getters }, { personId, jobName }) => {
    let gradeName = getters.currentGrade
    let grade = getters.grade(gradeName)
    let person = getters.personById(personId)
    let job = getters.jobByName(jobName)
    commit('removePersonFromJob', { grade, person, job })
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
