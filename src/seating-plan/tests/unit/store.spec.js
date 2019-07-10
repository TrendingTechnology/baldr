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

    it('getJobsOfPerson', () => {
      let person = store.getters.personById('1a: Friedrich, Josef')

      // Lüftwart
      store.dispatch('addPersonToJob', {
        personId: '1a: Friedrich, Josef',
        jobName: 'Lüftwart'
      })
      assert.deepEqual(store.getters.getJobsOfPerson(person), ['Lüftwart'])

      // Schaltwart
      store.dispatch('addPersonToJob', {
        personId: '1a: Friedrich, Josef',
        jobName: 'Schaltwart'
      })
      assert.deepEqual(
        store.getters.getJobsOfPerson(person),
        ['Lüftwart', 'Schaltwart']
      )
    })
  })

  describe('actions', function () {
    it('addPerson', function () {
      let person = new Person('Max', 'Mustermann', '1x')
      store.dispatch('addPerson', person)
      let personById = store.getters.personById('1x: Mustermann, Max')
      assert.strictEqual(personById.firstName, 'Max')
      let grade = store.getters.grade(person.grade)
      assert.strictEqual(grade.name, '1x')
      let persons = store.getters.personsByGrade(person.grade)
      assert.strictEqual(persons.length, 1)
      // personsCount is 1
      assert.strictEqual(store.state.grades['1x'].personsCount, 1)
    })

    it('deletePerson', function () {
      let person = new Person('Max', 'Mustermann', '1x')
      store.dispatch('addPerson', person)
      store.dispatch('placePersonById', {
        seatNo: 1,
        personId: '1x: Mustermann, Max'
      })
      store.dispatch('addPersonToJob', {
        personId: '1x: Mustermann, Max',
        jobName: 'Lüftwart'
      })

      // Delete
      store.dispatch('deletePerson', person)
      // personsCount is 0
      assert.strictEqual(store.state.grades['1x'].personsCount, 0)
      // personsPlacedCount is 0
      assert.strictEqual(store.state.grades['1x'].personsPlacedCount, 0)
      // Grade is empty
      let persons = store.getters.personsByGrade(person.grade)
      assert.strictEqual(persons.length, 0)
      // Person has no seat
      assert.isFalse(store.state.plans['1x'].hasOwnProperty(1))
      // Person has no jobs
      assert.isFalse(store.state.grades['1x'].jobs.hasOwnProperty('Lüftwart'))
    })

    it('placePersonById', function () {
      store.dispatch('placePersonById', {
        seatNo: 1,
        personId: '1a: Friedrich, Josef'
      })
      assert.strictEqual(store.state.plans['1a'][1].firstName, 'Josef')
    })

    it('addPersonToJob', function () {
      store.dispatch('addPersonToJob', {
        personId: '1a: Friedrich, Josef',
        jobName: 'Lüftwart'
      })
      let jobs = store.state.grades['1a'].jobs
      assert.strictEqual(
        jobs['Lüftwart']['1a: Friedrich, Josef'].firstName, 'Josef'
      )
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
