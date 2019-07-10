/* globals describe it beforeEach afterEach */

import { assert } from 'chai'

import store, { flushState } from '../../src/store'
import { Person } from '../../src/store/modules/persons'

describe('Vuex global store #unittest', () => {
  beforeEach(() => {
    store.dispatch('createTestData')
    store.commit('setCurrentGrade', '1a')
  })

  afterEach(() => flushState())

  describe('getters', () => {
    it('person', () => {
      let person = store.getters.person({ firstName: 'Josef', lastName: 'Friedrich', grade: '1a' })
      assert.strictEqual(person.firstName, 'Josef')
    })

    it('personById', () => {
      let person = store.getters.personById('1a: Friedrich, Josef')
      assert.strictEqual(person.firstName, 'Josef')
    })

    it('personsByGrade: 1a', () => {
      let grade1a = store.getters.personsByGrade('1a')
      assert.strictEqual(grade1a[0].firstName, 'Josef')
    })

    it('personsByGrade: 1b', () => {
      let grade1b = store.getters.personsByGrade('1b')
      assert.strictEqual(grade1b.length, 7)
    })

    it('personsByCurrentGrade', () => {
      let grade1a = store.getters.personsByCurrentGrade
      assert.strictEqual(grade1a.length, 1)
      assert.strictEqual(grade1a[0].firstName, 'Josef')
    })
  })

  describe('actions', function () {
    it('deletePerson', function () {
      let person = new Person('Max', 'Mustermann', '1x')
      store.dispatch('addPerson', person)
      let personById = store.getters.personById('1x: Mustermann, Max')
      assert.strictEqual(personById.firstName, 'Max')
      let grade = store.getters.grade(person.grade)
      assert.strictEqual(grade.name, '1x')
      let persons = store.getters.personsByGrade(person.grade)
      assert.strictEqual(persons.length, 1)
      store.dispatch('deletePerson', person)
      persons = store.getters.personsByGrade(person.grade)
      assert.strictEqual(persons.length, 0)
    })
  })

  describe('flushState', () => {
    it('app', () => {
      store.dispatch('showModal')
      assert.strictEqual(store.state.app.showModal, true)
      flushState()
      assert.strictEqual(store.state.app.showModal, false)
    })

    it('jobs', () => {
      assert.strictEqual(store.getters.listJobs.length, 5)
      flushState()
      assert.strictEqual(store.getters.listJobs.length, 0)
    })

    it('seats', () => {
      flushState()
      assert.strictEqual(store.state.seats.count, 32)
    })
  })
})
