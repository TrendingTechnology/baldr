import axios from 'axios'

const state = {
  savedStatesDates: []
}

const getters = {
  savedStatesDates: (state) => {
    return state.savedStatesDates
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
  importFromSpreadsheet: ({ dispatch }, importString) => {
    const lines = importString.split('\n')
    for (const line of lines) {
      const match = line.match(/(.*)\t(.*)\t(.*)\t(.*)\t([^]*)/)
      if (match && match[1] !== 'Familienname' && match[1] !== 'Insgesamt:') {
        const lastName = match[1]
        const firstName = match[2]
        const grade = match[4]
        dispatch('createPerson', { firstName, lastName, grade })
      }
    }
  },
  async fetchSavedStatesDates ({ commit }) {
    const response = await axios.get(
      'https://baldr.friedrich.rocks/api/seating-plan'
    )
    const dates = response.data.sort().reverse().slice(0, 10)
    commit('fetchSavedStatesDates', dates)
  },
  async importFromRestAPI ({ dispatch }, timeStampMsec) {
    const response = await axios.get(
      `https://baldr.friedrich.rocks/api/seating-plan/${timeStampMsec}`
    )
    dispatch('importState', response.data)
    return timeStampMsec
  },
  async deleteStateFromRestAPI ({ dispatch }, timeStampMsec) {
    await axios.delete(
      `https://baldr.friedrich.rocks/api/seating-plan/${timeStampMsec}`
    )
    dispatch('fetchSavedStatesDates')
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
  fetchSavedStatesDates: (state, dates) => {
    state.savedStatesDates = dates
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
