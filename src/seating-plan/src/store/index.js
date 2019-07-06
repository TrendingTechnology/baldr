import Vuex from 'vuex'
import Vue from 'vue'

import app from './modules/app'
import grades from './modules/grades'
import jobs from './modules/jobs'
import persons from './modules/persons'
import plans from './modules/plans'
import seats from './modules/seats'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { app, grades, jobs, persons, plans, seats }
})
