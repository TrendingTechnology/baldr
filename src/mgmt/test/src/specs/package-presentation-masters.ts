import masterCollection from '@bldr/presentation-masters'

import assert from 'assert'

describe('Package “@bldr/presentation-masters”', function () {
  it('Class “Master()”: name', async function () {
    const master = masterCollection.get('quote')
    assert.strictEqual(master.name, 'quote')
  })

  it('Class “Master()”: title', async function () {
    const master = masterCollection.get('quote')
    assert.strictEqual(master.title, 'Zitat')
  })
})
