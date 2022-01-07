/* globals describe it beforeEach afterEach */

import { assert } from 'chai'

import store, { flushState } from '../../src/store'

describe('Vuex store: app #unittest', function () {
  beforeEach(function () {
    store.dispatch('createTestData')
    store.commit('setGradeNameCurrent', '1a')
  })

  afterEach(function () {
    flushState()
  })

  describe('getters', function () {
    it('gradeNameCurrent', function () {
      assert.strictEqual(store.getters.gradeNameCurrent, '1a')
    })

    it('seatNoCurrent', function () {
      assert.strictEqual(store.getters.seatNoCurrent, null)
    })
  })

  describe('mutations', function () {
    it('flushJobsState', function () {
      store.commit('setGradeNameCurrent', '1x')
      store.commit('setSeatNoCurrent', 69)

      store.commit('flushAppState')
      assert.strictEqual(store.getters.gradeNameCurrent, null)
      assert.strictEqual(store.getters.seatNoCurrent, null)
    })

    it('setGradeNameCurrent', function () {
      store.commit('setGradeNameCurrent', '1x')
      assert.strictEqual(store.getters.gradeNameCurrent, '1x')
    })

    it('setSeatNoCurrent', function () {
      store.commit('setSeatNoCurrent', 69)
      assert.strictEqual(store.getters.seatNoCurrent, 69)
    })
  })
})
