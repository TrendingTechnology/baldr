const state = {

}

const getters = {

}

const actions = {
  importFromSpreadsheet: ({ dispatch }, importString) => {
    let lines = importString.split('\n')
    for (let line of lines) {
      let match = line.match(/(.*)\t(.*)\t(.*)\t(.*)\t([^]*)/)
      if (match && match[1] !== 'Familienname' && match[1] !== 'Insgesamt:') {
        let lastName = match[1]
        let firstName = match[2]
        let grade = match[4]
        console.log(line)
        dispatch('addPerson', { firstName, lastName, grade })
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
