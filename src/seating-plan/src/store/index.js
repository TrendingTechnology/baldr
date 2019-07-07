import Vuex from 'vuex'
import Vue from 'vue'

import app from './modules/app'
import grades from './modules/grades'
import importer from './modules/importer'
import jobs from './modules/jobs'
import persons from './modules/persons'
import plans from './modules/plans'
import seats from './modules/seats'

Vue.use(Vuex)

const getters = {
  getState: (state) => {
    return state
  }
}

const actions = {
  importState: ({ commit }, jsonString) => {

  }
}

export default new Vuex.Store({
  modules: { app, grades, importer, jobs, persons, plans, seats },
  getters,
  actions
})
