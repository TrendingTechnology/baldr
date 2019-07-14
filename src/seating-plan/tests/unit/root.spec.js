/* globals describe it beforeEach afterEach */

import { assert } from 'chai'

import store, { flushState } from '../../src/store'

describe('Vuex store: root #unittest', function () {
  beforeEach(function () {
    store.dispatch('createTestData')
    store.commit('setCurrentGrade', '1a')
  })

  afterEach(function () {
    flushState()
  })

  describe('flushState', function () {
    it('app', function () {
      store.dispatch('showModal')
      assert.strictEqual(store.state.app.showModal, true)
      flushState()
      assert.strictEqual(store.state.app.showModal, false)
    })

    it('jobs', function () {
      assert.strictEqual(store.getters.jobsAsArray.length, 5)
      flushState()
      assert.strictEqual(store.getters.jobsAsArray.length, 0)
    })

    it('seats', function () {
      flushState()
      assert.strictEqual(store.state.seats.count, 32)
    })
  })
})
