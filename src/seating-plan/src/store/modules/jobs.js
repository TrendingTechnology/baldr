class Job {
  constructor (name, icon) {
    this.name = name
    this.icon = icon
  }
}

const state = {
  jobs: {}
}

const getters = {
  listJobs () {
    let names = Object.keys(state.jobs).sort()
    let jobs = []
    for (let name of names) {
      jobs.push(state.jobs[name])
    }
    return jobs
  }
}

const actions = {
  addJobX ({ commit }, { name, icon }) {
    let job = new Job(name, icon)
    commit('addJob', job)
  }
}

const mutations = {
  addJob (state, job) {
    if (!state.jobs.hasOwnProperty(job.name)) {
      state.jobs[job.name] = job
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
