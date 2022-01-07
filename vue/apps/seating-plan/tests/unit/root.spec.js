/* globals describe it beforeEach afterEach */

import { assert } from 'chai'
import path from 'path'
import fs from 'fs'
import store, { flushState } from '../../src/store'

describe('Vuex store: root #unittest', function () {
  beforeEach(function () {
    store.dispatch('createTestData')
    store.commit('setGradeNameCurrent', '1a')
    store.commit('setTimeStampMsec')
  })

  afterEach(function () {
    flushState()
  })

  describe('getters', function () {
    it('exportStateObject', function () {
      const state = store.getters.exportStateObject
      assert.isFalse({}.hasOwnProperty.call(state, 'app'))
      assert.isFalse({}.hasOwnProperty.call(state, 'importer'))
      assert.isFalse({}.hasOwnProperty.call(state, 'seats'))
      assert.isTrue({}.hasOwnProperty.call(state, 'grades'))
      assert.isTrue({}.hasOwnProperty.call(state, 'jobs'))
      assert.isNumber(state.timeStampMsec)
    })

    it('exportStateString', function () {
      const state = store.getters.exportStateString
      assert.strictEqual(state.indexOf('{"grades":{"1a":'), 0)
    })

    it('state', function () {
      const state = store.getters.state
      assert.isTrue({}.hasOwnProperty.call(state, 'grades'))
    })

    it('stateAsUriComponent', function () {
      const component = store.getters.stateAsUriComponent
      const prefix = 'data:text/json;charset=utf-8,'
      assert.strictEqual(component.indexOf(prefix), 0)
      const jsonString = decodeURIComponent(component.replace(prefix, ''))
      const state = JSON.parse(jsonString)
      assert.deepEqual(state.grades['1a']['Friedrich, Josef'], {})
    })
  })

  describe('actions', function () {
    it('importState', function () {
      const exportJsonFile = path.resolve('tests', 'files', 'export.json')
      const jsonString = fs.readFileSync(exportJsonFile, { encoding: 'utf-8' })
      store.dispatch('importState', jsonString)
      // Person with jobs and seat number.
      let person = store.getters.personById('1a: Friedrich, Josef')
      assert.strictEqual(person.seatNo, 1)
      assert.deepEqual(person.jobs, ['Lüftwart'])
      // Person without jobs and seat number.
      person = store.getters.personById('1b: Wagenknecht, Nicolas')
      assert.strictEqual(person.seatNo, 0)
      assert.deepEqual(person.jobs, [])
      // Job only available in the export.json
      const job = store.getters.jobByName('Testjob')
      assert.strictEqual(job.icon, 'test')
      assert.strictEqual(store.getters.meta('teacher'), 'OStR Josef Friedrich')
    })

    it.skip('saveToLocalStorage', function () {
      store.dispatch('saveToLocalStorage')
    })
  })

  describe('flushState', function () {
    it('app', function () {
      store.commit('setGradeNameCurrent', '1x')
      assert.strictEqual(store.getters.gradeNameCurrent, '1x')
      flushState()
      assert.strictEqual(store.getters.gradeNameCurrent, null)
    })

    it('importer', function () {
      store.commit('setTimeStampMsec', 1234)
      flushState()
      assert.strictEqual(store.getters.timeStampMsec, 0)
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
