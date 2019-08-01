/* globals describe it beforeEach afterEach */

import { assert } from 'chai'

import store, { flushState } from '../../src/store'

describe('Vuex store: meta #unittest', function () {
  beforeEach(function () {
    store.dispatch('createTestData')
    store.commit('setGradeNameCurrent', '1a')
  })

  afterEach(function () {
    flushState()
  })

  describe('getters', function () {
    it('meta', function () {
      assert.strictEqual(store.getters.meta('teacher'), '')
    })

    it('metaLocation', function () {
      assert.strictEqual(store.getters.metaLocation, '')
    })

    it('metaTeacher', function () {
      assert.strictEqual(store.getters.metaTeacher, '')
    })

    it('metaYear', function () {
      assert.strictEqual(store.getters.metaYear, '')
    })
  })

  describe('mutations', function () {
    it('setMeta', function () {
      store.commit('setMeta', { key: 'teacher', value: 'test' })
      assert.strictEqual(store.getters.meta('teacher'), 'test')
    })
  })
})
