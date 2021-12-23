import Vue from 'vue'

class Job {
  constructor (name, icon) {
    this.name = name
    this.icon = icon
  }

  toJSON () {
    return {
      icon: this.icon
    }
  }
}

const state = {}

const getters = {
  jobByName: state => jobName => {
    return state[jobName]
  },
  jobIconFromName: (state, getters) => jobName => {
    const job = getters.jobByName(jobName)
    return job.icon
  },
  jobsAsArray: state => {
    const names = Object.keys(state)
    const jobs = []
    for (const name of names) {
      jobs.push(state[name])
    }
    return jobs
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
  createJob: ({ commit }, { name, icon }) => {
    const job = new Job(name, icon)
    commit('createJob', job)
  },
  deleteJob: ({ commit }, jobName) => {
    commit('deleteJob', jobName)
  },
  importJobsState: ({ dispatch, commit }, newState) => {
    commit('flushJobsState')
    for (const jobName in newState) {
      const job = newState[jobName]
      dispatch('createJob', {
        name: jobName,
        icon: job.icon
      })
    }
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
  createJob: (state, job) => {
    if (!{}.hasOwnProperty.call(state, job.name)) {
      Vue.set(state, job.name, job)
    }
  },
  deleteJob: (state, jobName) => {
    Vue.delete(state, jobName)
  },
  flushJobsState: state => {
    for (const property of Object.keys(state)) {
      delete state[property]
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
