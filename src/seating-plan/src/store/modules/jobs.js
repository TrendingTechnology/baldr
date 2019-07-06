class Job {
  constructor (name, icon) {
    this.name = name
    this.icon = icon
  }
}

const state = {}

const getters = {
  listJobs () {
    let names = Object.keys(state).sort()
    let jobs = []
    for (let name of names) {
      jobs.push(state.jobs[name])
    }
    return jobs
  }
}

const actions = {
  addJob ({ commit }, { name, icon }) {
    let job = new Job(name, icon)
    commit('addJob', job)
  }
}

const mutations = {
  addJob (state, job) {
    if (!state.hasOwnProperty(job.name)) {
      state[job.name] = job
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
