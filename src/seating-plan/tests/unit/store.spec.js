/* globals describe it */

import { assert } from 'chai'

import store from '../../src/store'

store.dispatch('createTestData')
store.commit('setCurrentGrade', '1a')

describe('Vuex global store #unittest', () => {
  describe('getters', () => {
    it('person', () => {
      let person = store.getters.person({ firstName: 'Josef', lastName: 'Friedrich', grade: '1a' })
      assert.equal(person.firstName, 'Josef')
    })

    it('personById', () => {
      let person = store.getters.personById('1a: Friedrich, Josef')
      assert.equal(person.firstName, 'Josef')
    })

    it('personsByGrade: 1a', () => {
      let grade1a = store.getters.personsByGrade('1a')
      assert.equal(grade1a[0].firstName, 'Josef')
    })

    it('personsByGrade: 1b', () => {
      let grade1b = store.getters.personsByGrade('1b')
      assert.equal(grade1b.length, 7)
    })

    it('personsByCurrentGrade', () => {
      let grade1a = store.getters.personsByCurrentGrade
      assert.equal(grade1a.length, 1)
      assert.equal(grade1a[0].firstName, 'Josef')
    })
  })
})
