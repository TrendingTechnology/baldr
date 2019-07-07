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
  },
  getCurrentGradeObject: (state, getters) => {
    let gradeName = getters.getCurrentGrade
    if (gradeName) {
      return getters.getGrade(gradeName)
    }
  },
  getCurrentPersonsCount: (state, getters) => {
    let grade = getters.getGrade(getters.getCurrentGrade)
    return grade.personsCount
  },
  getJobsOfGrade: (state, getters) => (gradeName) => {
    let grade = getters.getGrade(gradeName)
    if (grade.hasOwnProperty('jobs')) {
      return grade.jobs
    }
    return {}
  },
  getJobsOfCurrentGrade: (state, getters) => {
    return getters.getJobsOfGrade(getters.getCurrentGrade)
  },
  /**
   * Indicate if all persons in a grade are having a seat and are places.
   *
   * @returns boolean
   */
  isGradePlaced: (state, getters) => {
    let grade = getters.getCurrentGradeObject
    if (grade && grade.personsCount === grade.personsPlacedCount) {
      return true
    }
    return false
  },
  hasPersonJob: (state, getters) => (personId, jobName) => {
    if (!personId) {
      return false
    }
    let grade = getters.getCurrentGradeObject
    return grade.hasOwnProperty('jobs') &&
      grade.jobs.hasOwnProperty(jobName) &&
      grade.jobs[jobName].hasOwnProperty(personId)
  }
}

const actions = {
  addGrade: ({ commit, getters }, name) => {
    if (!getters.getGrade(name)) {
      let grade = new Grade(name)
      commit('addGrade', grade)
    }
  },
  addPersonToJob: ({ commit, getters }, { personId, jobName }) => {
    let gradeName = getters.getCurrentGrade
    let grade = getters.getGrade(gradeName)
    let person = getters.getPersonById(personId)
    let job = getters.getJobByName(jobName)
    commit('addPersonToJob', { grade, person, job })
  },
  removePersonFromJob: ({ commit, getters }, { personId, jobName }) => {
    let gradeName = getters.getCurrentGrade
    let grade = getters.getGrade(gradeName)
    let person = getters.getPersonById(personId)
    let job = getters.getJobByName(jobName)
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
