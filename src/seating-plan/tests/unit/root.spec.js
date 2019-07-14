/* globals describe it beforeEach afterEach */

import { assert } from 'chai'
import path from 'path'
import fs from 'fs'
import store, { flushState } from '../../src/store'

describe('Vuex store: root #unittest', function () {
  beforeEach(function () {
    store.dispatch('createTestData')
    store.commit('setCurrentGrade', '1a')
  })

  afterEach(function () {
    flushState()
  })

  describe('getters', function () {
    it('state', function () {
      const state = store.getters.state
      assert.isTrue({}.hasOwnProperty.call(state, 'grades'))
    })

    it('stateAsURIComponent', function () {
      const component = store.getters.stateAsURIComponent
      assert.strictEqual(component.indexOf('data:text/json;charset=utf-8,'), 0)
    })
  })

  describe('actions', function () {
    it('importState', function () {
      const exportJsonFile = path.resolve('tests', 'files', 'export.json')
      const jsonString = fs.readFileSync(exportJsonFile, { encoding: 'utf-8' })
      store.dispatch('importState', jsonString)
      let person = store.getters.personById('1a: Friedrich, Josef')
      assert.strictEqual(person.seatNo, 1)
      assert.deepEqual(person.jobs, ['Lüftwart'])
      person = store.getters.personById('1b: Wagenknecht, Nicolas')
      assert.strictEqual(person.seatNo, 0)
      assert.deepEqual(person.jobs, [])
    })
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
