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

    it('showModal', function () {
      assert.strictEqual(store.getters.showModal, false)
    })

    it('seatNoCurrent', function () {
      assert.strictEqual(store.getters.seatNoCurrent, null)
    })
  })

  describe('actions', function () {
    it('showModal', function () {
      store.dispatch('showModal')
      assert.strictEqual(store.getters.showModal, true)
    })
    it('closeModal', function () {
      store.dispatch('closeModal')
      assert.strictEqual(store.getters.showModal, false)
    })
  })

  describe('mutations', function () {
    it('flushJobsState', function () {
      store.commit('setGradeNameCurrent', '1x')
      store.commit('setSeatNoCurrent', 69)
      store.dispatch('showModal')

      store.commit('flushAppState')
      assert.strictEqual(store.getters.gradeNameCurrent, null)
      assert.strictEqual(store.getters.seatNoCurrent, null)
      assert.strictEqual(store.getters.showModal, false)
    })

    it('setGradeNameCurrent', function () {
      store.commit('setGradeNameCurrent', '1x')
      assert.strictEqual(store.getters.gradeNameCurrent, '1x')
    })

    it('setSeatNoCurrent', function () {
      store.commit('setSeatNoCurrent', 69)
      assert.strictEqual(store.getters.seatNoCurrent, 69)
    })

    it('setShowModal', function () {
      store.commit('setShowModal', true)
      assert.strictEqual(store.getters.showModal, true)
    })
  })
})
