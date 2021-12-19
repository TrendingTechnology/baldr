/* globals describe it */

const assert = require('assert')

const { categories } = require('@bldr/media-categories')
const { query } = require('../dist/node/main.js')

describe('Package “@bldr/wikidata”', function () {
  it('Methode “query()”', async function () {
    this.timeout(10000)
    const result = await query('Q254', 'person', categories)

    assert.strictEqual(result.wikidata, 'Q254')
    assert.strictEqual(result.wikipedia, 'de:Wolfgang_Amadeus_Mozart')
    assert.strictEqual(result.firstname, 'Wolfgang')
    assert.strictEqual(result.lastname, 'Mozart')
    assert.strictEqual(result.birth, '1756-01-27')
    assert.strictEqual(result.death, '1791-12-05')
    assert.strictEqual(result.name, 'Wolfgang Amadeus Mozart')
  })
})
