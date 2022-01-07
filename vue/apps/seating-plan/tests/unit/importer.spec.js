/* globals describe it beforeEach afterEach */

import { assert } from 'chai'

import store, { flushState } from '../../src/store'

describe('Vuex store: importer #unittest', function () {
  beforeEach(function () {
    store.dispatch('createTestData')
    store.commit('setGradeNameCurrent', '1a')
  })

  afterEach(function () {
    flushState()
  })

  describe('getters', function () {
    it('importInProgress', function () {
      assert.strictEqual(store.getters.importInProgress, true)
    })

    it('stateChanged', function () {
      assert.strictEqual(store.getters.stateChanged, false)
    })
  })

  describe('mutations', function () {
    it('setApiVersion', function () {
      store.commit('setApiVersion', '1.2.3')
      assert.strictEqual(store.getters.apiVersion, '1.2.3')
    })

    it('setImportInProgress', function () {
      store.commit('setImportInProgress', true)
      assert.strictEqual(store.getters.importInProgress, true)
    })

    it('setStateChanged', function () {
      store.commit('setStateChanged', true)
      assert.strictEqual(store.getters.stateChanged, true)
    })

    it('setTimeStampMsec', function () {
      store.commit('setTimeStampMsec', 1234)
      assert.strictEqual(store.getters.timeStampMsec, 1234)
    })
  })
})
