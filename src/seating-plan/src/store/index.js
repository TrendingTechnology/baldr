import Vuex from 'vuex'
import Vue from 'vue'
import jobs from './modules/jobs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    jobs
  }
})
