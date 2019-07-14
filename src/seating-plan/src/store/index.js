import Vuex from 'vuex'
import Vue from 'vue'

import app from './modules/app'
import grades from './modules/grades'
import importer from './modules/importer'
import jobs from './modules/jobs'
import seats from './modules/seats'

Vue.use(Vuex)

const getters = {
  state: (state) => {
    return state
  },
  stateAsURIComponent: (state, getters) => {
    const string = encodeURIComponent(JSON.stringify(getters.state))
    return `data:text/json;charset=utf-8,${string}`
  }
}

const actions = {
  importState: ({ commit }, jsonString) => {

  },
  createTestData: ({ dispatch }) => {
    // https://realnamecreator.alexjonas.de/?l=de#
    const peopleList = [
      // 1a
      { firstName: 'Josef', lastName: 'Friedrich', grade: '1a' },
      // 1b
      { firstName: 'Nicolas', lastName: 'Wagenknecht', grade: '1b' },
      { firstName: 'Cornelia', lastName: 'Fierek', grade: '1b' },
      { firstName: 'Volker', lastName: 'Englisch', grade: '1b' },
      { firstName: 'Hannah', lastName: 'Fenske', grade: '1b' },
      { firstName: 'Alena', lastName: 'Röhner', grade: '1b' },
      { firstName: 'Katrin', lastName: 'Knospe', grade: '1b' },
      { firstName: 'Angelina', lastName: 'Hüttner', grade: '1b' },
      // 10a
      { firstName: 'Tina', lastName: 'Gaudig', grade: '10a' },
      { firstName: 'Maurice', lastName: 'Grün', grade: '10a' },
      { firstName: 'Alex', lastName: 'Kögel', grade: '10a' },
      { firstName: 'Christine', lastName: 'Stremlau', grade: '10a' },
      { firstName: 'Marlene', lastName: 'Thiem', grade: '10a' },
      { firstName: 'Julius', lastName: 'Bremer', grade: '10a' },
      { firstName: 'Inga', lastName: 'Hochstetter', grade: '10a' },
      { firstName: 'Roswitha', lastName: 'Gscheidle', grade: '10a' },
      { firstName: 'Lothar', lastName: 'Schöttler', grade: '10a' },
      { firstName: 'Axel', lastName: 'Göpfert', grade: '10a' },
      { firstName: 'Mike', lastName: 'Saalbach', grade: '10a' },
      { firstName: 'Nicholas', lastName: 'Enzmann', grade: '10a' },
      { firstName: 'Karin', lastName: 'Beilig', grade: '10a' },
      { firstName: 'Susanne', lastName: 'Delfs', grade: '10a' },
      { firstName: 'Waldemar', lastName: 'Tischer', grade: '10a' },
      { firstName: 'Karl-Heinz', lastName: 'Bandlow', grade: '10a' },
      { firstName: 'Katharina', lastName: 'Weigert', grade: '10a' },
      { firstName: 'Ulrike', lastName: 'Lukin', grade: '10a' },
      { firstName: 'Thorsten', lastName: 'Stüttem', grade: '10a' },
      // Q11
      { firstName: 'Sylke', lastName: 'Schyska', grade: 'Q11' },
      { firstName: 'Valentin', lastName: 'Schräber', grade: 'Q11' },
      { firstName: 'Oliver', lastName: 'Lembcke', grade: 'Q11' },
      { firstName: 'Siegfried', lastName: 'Golz', grade: 'Q11' },
      { firstName: 'Sylke', lastName: 'Schmitz', grade: 'Q11' },
      { firstName: 'Fritz', lastName: 'Hager', grade: 'Q11' },
      { firstName: 'Herta', lastName: 'Erhard', grade: 'Q11' },
      { firstName: 'Leon', lastName: 'Weinreich', grade: 'Q11' },
      { firstName: 'Ingo', lastName: 'Kaltenbach', grade: 'Q11' },
      { firstName: 'Jan-Hendrik', lastName: 'Siegfried', grade: 'Q11' },
      { firstName: 'Matthias', lastName: 'Pascha', grade: 'Q11' },
      { firstName: 'Viktor', lastName: 'Kappes', grade: 'Q11' },
      { firstName: 'Jens', lastName: 'Paschke', grade: 'Q11' },
      { firstName: 'Jutta', lastName: 'Wendeling', grade: 'Q11' },
      { firstName: 'Richard', lastName: 'Heinz', grade: 'Q11' },
      { firstName: 'Thomas', lastName: 'Grimmer', grade: 'Q11' }
    ]
    for (const person of peopleList) {
      dispatch('createPerson', person)
    }

    const jobs = [
      { name: 'Schaltwart', icon: 'video-switch' },
      // { name: 'Lüftwart', icon: 'window-maximize' },
      { name: 'Lüftwart', icon: 'air-filter' },
      { name: 'Austeilwart', icon: 'file-outline' },
      { name: 'Klassenbuchführer', icon: 'notebook' },
      { name: 'Klassensprecher', icon: 'account-star' }
    ]
    for (const job of jobs) {
      dispatch('createJob', job)
    }
  }
}

const mutations = {
  importState: (state, newState) => {

  }
}

const modules = { app, grades, importer, jobs, seats }

const store = new Vuex.Store({
  modules,
  getters,
  actions,
  mutations
})

export default store

export const flushState = function () {
  const state = store.state
  const newState = {}
  Object.keys(state).forEach(key => {
    if ({}.hasOwnProperty.call(modules[key], 'InitState')) {
      const InitState = modules[key].InitState
      newState[key] = new InitState()
    } else {
      newState[key] = {}
    }
  })
  store.replaceState(newState)
}
