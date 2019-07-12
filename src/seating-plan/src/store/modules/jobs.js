import Vue from 'vue'

class Job {
  constructor (name, icon) {
    this.name = name
    this.icon = icon
  }
}

const state = {}

const getters = {
  listJobs: (state) => {
    const names = Object.keys(state)
    const jobs = []
    for (const name of names) {
      jobs.push(state[name])
    }
    return jobs
  },
  jobByName: (state) => (jobName) => {
    return state[jobName]
  },
  jobIconFromName: (state, get) => (jobName) => {
    const job = get.jobByName(jobName)
    return job.icon
  }
}

const actions = {
  addJob: ({ commit }, { name, icon }) => {
    const job = new Job(name, icon)
    commit('addJob', job)
  },
  deleteJob: ({ commit }, jobName) => {
    commit('deleteJob', jobName)
  }
}

const mutations = {
  addJob: (state, job) => {
    if (!state.hasOwnProperty(job.name)) {
      Vue.set(state, job.name, job)
    }
  },
  deleteJob: (state, jobName) => {
    Vue.delete(state, jobName)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
