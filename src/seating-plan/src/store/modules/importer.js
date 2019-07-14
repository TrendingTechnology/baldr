const state = {

}

const getters = {

}

const actions = {
  importFromSpreadsheet: ({ dispatch }, importString) => {
    const lines = importString.split('\n')
    for (const line of lines) {
      const match = line.match(/(.*)\t(.*)\t(.*)\t(.*)\t([^]*)/)
      if (match && match[1] !== 'Familienname' && match[1] !== 'Insgesamt:') {
        const lastName = match[1]
        const firstName = match[2]
        const grade = match[4]
        console.log(line)
        dispatch('createPerson', { firstName, lastName, grade })
      }
    }
  }
}

const mutations = {

}

export default {
  state,
  getters,
  actions,
  mutations
}
