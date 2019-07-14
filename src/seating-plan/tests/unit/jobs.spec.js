/* globals describe it beforeEach afterEach */

import { assert } from 'chai'

import store, { flushState } from '../../src/store'

describe('Vuex store: jobs #unittest', function () {
  beforeEach(function () {
    store.dispatch('createTestData')
    store.commit('setCurrentGrade', '1a')
  })

  afterEach(function () {
    flushState()
  })

  describe('getters', function () {
    it('jobByName', function () {
      const job = store.getters.jobByName('Lüftwart')
      assert.strictEqual(job.name, 'Lüftwart')
    })

    it('jobIconFromName', function () {
      const icon = store.getters.jobIconFromName('Lüftwart')
      assert.strictEqual(icon, 'air-filter')
    })

    it('jobsAsArray', function () {
      const jobs = store.getters.jobsAsArray
      assert.strictEqual(jobs[0].name, 'Schaltwart')
    })
  })

  describe('actions', function () {
    it('createJob', function () {
      store.dispatch('createJob', { name: 'Test', icon: 'test' })
      const job = store.getters.jobByName('Test')
      assert.strictEqual(job.name, 'Test')
    })

    it('deleteJob', function () {
      store.dispatch('deleteJob', 'Schaltwart')
      const jobs = store.getters.jobsAsArray
      assert.strictEqual(jobs.length, 4)
    })
  })
})
