/* globals describe it beforeEach afterEach */

import { assert } from 'chai'

import store, { flushState } from '../../src/store'
import { Person } from '../../src/store/modules/grades'

describe('Vuex store: grades #unittest', function () {
  beforeEach(function () {
    store.dispatch('createTestData')
    store.commit('setGradeNameCurrent', '1a')
  })

  afterEach(function () {
    flushState()
  })

  describe('getters', function () {
    it('person', function () {
      const person = store.getters.person({ firstName: 'Josef', lastName: 'Friedrich', grade: '1a' })
      assert.strictEqual(person.firstName, 'Josef')
    })

    it('personById', function () {
      const person = store.getters.personById('1a: Friedrich, Josef')
      assert.strictEqual(person.firstName, 'Josef')
    })

    describe('personsByGrade', function () {
      it('1a', function () {
        const persons = store.getters.personsByGrade('1a')
        assert.strictEqual(persons['Friedrich, Josef'].firstName, 'Josef')
      })

      it('1b', function () {
        const persons = store.getters.personsByGrade('1b')
        assert.strictEqual(Object.keys(persons).length, 7)
      })
    })

    it('personsByGradeCurrent', function () {
      const persons = store.getters.personsByGradeCurrent
      assert.strictEqual(Object.keys(persons).length, 1)
      assert.strictEqual(persons['Friedrich, Josef'].firstName, 'Josef')
    })

    it('getJobsOfPerson', function () {
      const person = store.getters.personById('1a: Friedrich, Josef')

      // Lüftwart
      store.dispatch('addJobToPerson', {
        personId: '1a: Friedrich, Josef',
        jobName: 'Lüftwart'
      })
      assert.deepEqual(store.getters.jobsOfPerson(person), ['Lüftwart'])

      // Schaltwart
      store.dispatch('addJobToPerson', {
        personId: '1a: Friedrich, Josef',
        jobName: 'Schaltwart'
      })
      assert.deepEqual(
        store.getters.jobsOfPerson(person),
        ['Lüftwart', 'Schaltwart']
      )
    })

    it('personsByGrade', function () {
      const persons = store.getters.personsByGrade('1a')
      assert.strictEqual(persons['Friedrich, Josef'].firstName, 'Josef')
    })

    describe('personsCountCurrent', function () {
      it('1a', function () {
        store.commit('setGradeNameCurrent', '1a')
        assert.strictEqual(store.getters.personsCountCurrent, 1)
      })

      it('Q11', function () {
        store.commit('setGradeNameCurrent', 'Q11')
        assert.strictEqual(store.getters.personsCountCurrent, 16)
      })
    })

    describe('personsPlacedCount', function () {
      it('Unplaced', function () {
        assert.strictEqual(store.getters.personsPlacedCount('1a'), 0)
      })

      it('Place one', function () {
        store.dispatch('placePerson', {
          seatNo: 1,
          personId: '1a: Friedrich, Josef'
        })
        assert.strictEqual(store.getters.personsPlacedCount('1a'), 1)
      })
    })

    it('isGradePlacedCurrent', function () {
      assert.isFalse(store.getters.isGradePlacedCurrent)
      store.dispatch('placePerson', {
        seatNo: 1,
        personId: '1a: Friedrich, Josef'
      })
      assert.isTrue(store.getters.isGradePlacedCurrent)
    })

    it('jobsOfGrade', function () {
      const personId = '1a: Friedrich, Josef'
      store.dispatch('addJobToPerson', {
        personId,
        jobName: 'Lüftwart'
      })
      const jobs = store.getters.jobsOfGrade('1a')
      assert.strictEqual(jobs['Lüftwart']['Friedrich, Josef'].firstName, 'Josef')
    })
  })

  describe('actions', function () {
    it('addJobToPerson', function () {
      const personId = '1a: Friedrich, Josef'
      store.dispatch('addJobToPerson', {
        personId,
        jobName: 'Lüftwart'
      })
      const person = store.getters.personById(personId)
      const jobs = store.getters.jobsOfPerson(person)
      assert.deepStrictEqual(jobs, ['Lüftwart'])
    })

    it('createGrade', function () {
      store.dispatch('createGrade', '1x')
      assert.strictEqual(store.state.grades['1x'].name, '1x')
    })

    describe('createPerson', function () {
      it('normal', function () {
        const person = new Person('Max', 'Mustermann', '1x')
        store.dispatch('createPerson', person)
        const personById = store.getters.personById('1x: Mustermann, Max')
        assert.strictEqual(personById.firstName, 'Max')
        const grade = store.getters.grade(person.grade)
        assert.strictEqual(grade.name, '1x')
        const persons = store.getters.personsByGrade(person.grade)
        assert.strictEqual(Object.keys(persons).length, 1)
        // personsCount is 1
        assert.strictEqual(store.getters.personsCount('1x'), 1)
      })

      it('trim support', function () {
        store.dispatch('createPerson', { firstName: 'Max ', lastName: ' Mustermann', grade: ' 1x ' })
        const person = store.getters.personById('1x: Mustermann, Max')
        assert.strictEqual(person.firstName, 'Max')
        assert.strictEqual(person.lastName, 'Mustermann')
        assert.strictEqual(person.grade, '1x')
      })
    })

    describe('deleteGrade', function () {
      it('Grade contains persons', function () {
        store.dispatch('deleteGrade', '1a')
        assert.isFalse({}.hasOwnProperty.call(store.state.grades, '1a'))
      })

      it('Grade contains no persons', function () {
        store.dispatch('createGrade', '1x')
        store.dispatch('deleteGrade', '1x')
        assert.isFalse({}.hasOwnProperty.call(store.state.grades, '1x'))
      })
    })

    it('deletePerson', function () {
      const person = new Person('Max', 'Mustermann', '1x')
      store.dispatch('createPerson', person)
      store.commit('setGradeNameCurrent', person.grade)
      store.dispatch('placePerson', {
        seatNo: 1,
        personId: '1x: Mustermann, Max'
      })
      store.dispatch('addJobToPerson', {
        personId: '1x: Mustermann, Max',
        jobName: 'Lüftwart'
      })

      // Delete
      store.dispatch('deletePerson', person)
      // personsCount is 0
      assert.strictEqual(store.getters.personsCount('1x'), 0)
      // personsPlacedCount is 0
      assert.strictEqual(store.getters.personsPlacedCountCurrent, 0)
      // Grade is empty
      const persons = store.getters.personsByGrade(person.grade)
      assert.strictEqual(Object.keys(persons).length, 0)
    })

    it('placePerson', function () {
      const personId = '1a: Friedrich, Josef'
      const seatNo = 1
      store.dispatch('placePerson', { seatNo, personId })
      const person = store.getters.personById(personId)
      assert.strictEqual(person.seatNo, 1)
    })

    it('removeJobFromPerson', function () {
      const personId = '1a: Friedrich, Josef'
      const jobName = 'Lüftwart'
      store.dispatch('addJobToPerson', { personId, jobName })
      store.dispatch('removeJobFromPerson', { personId, jobName })
      const person = store.getters.personById(personId)
      const jobs = store.getters.jobsOfPerson(person)
      assert.deepEqual(jobs, [])
    })

    it('unplacePerson', function () {
      const personId = '1a: Friedrich, Josef'
      const seatNo = 1
      store.dispatch('placePerson', { seatNo, personId })
      store.dispatch('unplacePerson', { personId, seatNo })
      const person = store.getters.personById(personId)
      assert.strictEqual(person.seatNo, 0)
    })
  })

  describe('Mutations', function () {
    it('flushGradesState', function () {
      store.commit('flushGradesState')
      assert.deepEqual(store.getters.gradeNames, [])
    })

    describe('renameGrade', function () {
      it('1a -> 1x', function () {
        store.commit('renameGrade', {
          oldGradeName: '1a',
          newGradeName: '1x'
        })
        const person = store.getters.personById('1x: Friedrich, Josef')
        assert.strictEqual(person.firstName, 'Josef')
        assert.strictEqual(person.grade, '1x')
      })

      it('1a -> 1a', function () {
        store.commit('renameGrade', {
          oldGradeName: '1a',
          newGradeName: '1a'
        })
        const person = store.getters.personById('1a: Friedrich, Josef')
        assert.strictEqual(person.firstName, 'Josef')
        assert.strictEqual(person.grade, '1a')
      })

      it('1a -> ', function () {
        store.commit('renameGrade', {
          oldGradeName: '1a',
          newGradeName: ''
        })
        const person = store.getters.personById('1a: Friedrich, Josef')
        assert.strictEqual(person.firstName, 'Josef')
        assert.strictEqual(person.grade, '1a')
      })
    })

    describe('renamePerson', function () {
      it('Josef Friedrich -> Josi Friedrich', function () {
        const person = store.getters.personById('1a: Friedrich, Josef')
        store.commit('renamePerson', {
          person: person,
          newFirstName: 'Josi',
          newLastName: 'Friedrich'
        })
        const newPerson = store.getters.personById('1a: Friedrich, Josi')
        assert.strictEqual(newPerson.firstName, 'Josi')
        assert.strictEqual(newPerson.lastName, 'Friedrich')
        const oldPerson = store.getters.personById('1a: Friedrich, Josef')
        assert.strictEqual(oldPerson, false)
      })

      it('Josef Friedrich -> Josi (Friedrich)', function () {
        const person = store.getters.personById('1a: Friedrich, Josef')
        store.commit('renamePerson', {
          person: person,
          newFirstName: 'Josi'
        })
        const newPerson = store.getters.personById('1a: Friedrich, Josi')
        assert.strictEqual(newPerson.firstName, 'Josi')
      })

      it('Josef Friedrich -> Josef Friedrich', function () {
        const person = store.getters.personById('1a: Friedrich, Josef')
        store.commit('renamePerson', {
          person: person,
          newFirstName: 'Josef',
          newLastName: 'Friedrich'
        })
        const newPerson = store.getters.personById('1a: Friedrich, Josef')
        assert.strictEqual(newPerson.firstName, 'Josef')
        assert.strictEqual(newPerson.lastName, 'Friedrich')
      })
    })
  })

  describe('Classes', function () {
    it('Person.prototype.splitName', function () {
      const result = Person.prototype.splitName('Friedrich, Josef')
      assert.deepEqual(result, {
        firstName: 'Josef',
        lastName: 'Friedrich'
      })
    })
  })
})
