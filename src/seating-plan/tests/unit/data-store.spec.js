/* globals describe it */

import { assert } from 'chai'
import dataStore from '@/data-store.js'

describe('Singleton object “dataStore” #unittest', () => {
  it('dataStore.data', () => {
    assert.ok(dataStore.data)
  })

  it('dataStore.addPerson', () => {
    dataStore.createTestData()
    dataStore.syncData()
    assert.strictEqual(dataStore.data.persons['10a']['Gaudig']['Tina'].lastName, 'Gaudig')
    assert.strictEqual(dataStore.getPerson('Tina', 'Gaudig', '10a').lastName, 'Gaudig')
  })
})
