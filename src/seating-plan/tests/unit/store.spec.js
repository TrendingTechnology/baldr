/* globals describe it */

import { assert } from 'chai'

import store from '../../src/store'

describe('Vuex global store #unittest', () => {
  it('getters.personsByGrade', () => {
    store.dispatch('createTestData')
    let grade1a = store.getters.personsByGrade('1a')
    assert.equal(grade1a[0].firstName, 'Josef')
    let grade1b = store.getters.personsByGrade('1b')
    assert.equal(grade1b.length, 7)
  })
})
