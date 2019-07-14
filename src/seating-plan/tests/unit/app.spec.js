/* globals describe it beforeEach afterEach */

import { assert } from 'chai'

import store, { flushState } from '../../src/store'

describe('Vuex store: app #unittest', function () {
  beforeEach(function () {
    store.dispatch('createTestData')
    store.commit('setCurrentGrade', '1a')
  })

  afterEach(function () {
    flushState()
  })

  describe('actions', function () {
    it('showModal', function () {
      store.dispatch('showModal')
      assert.strictEqual(store.getters.modalState, true)
    })
    it('closeModal', function () {
      store.dispatch('closeModal')
      assert.strictEqual(store.getters.modalState, false)
    })
  })

  describe('mutations', function () {
    it('flushJobsState', function () {
      store.commit('setCurrentGrade', '1x')
      store.commit('setCurrentSeat', 69)
      store.dispatch('showModal')

      store.commit('flushAppState')
      assert.strictEqual(store.getters.currentGrade, null)
      assert.strictEqual(store.getters.currentSeat, null)
      assert.strictEqual(store.getters.modalState, false)
    })

    it('setCurrentGrade', function () {
      store.commit('setCurrentGrade', '1x')
      assert.strictEqual(store.getters.currentGrade, '1x')
    })

    it('setCurrentSeat', function () {
      store.commit('setCurrentSeat', 69)
      assert.strictEqual(store.getters.currentSeat, 69)
    })
  })
})
