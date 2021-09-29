/* globals it */

const assert = require('assert')

const { getFirstImage, getHtmlBody } = require('../dist/node/main.js')

it('Function getFirstImage()', async function () {
  const result = await getFirstImage('Wolfgang_Amadeus_Mozart', 'de')
  assert.ok(result.includes('https://upload.wikimedia.org'))
  assert.ok(result.includes('.jpg'))
})

describe('Function getHtmlBody()', function () {
  it('without oldid', async function () {
    this.timeout(10000)
    const result = await getHtmlBody('Wolfgang_Amadeus_Mozart', 'de')
    assert.ok(result.includes('Mozart'))
  })

  it('oldid', async function () {
    const result = await getHtmlBody('Wolfgang_Amadeus_Mozart', 'de', 15270)
    assert.ok(result.includes('"Zur Wohltätigkeit"'))
  })

  it('image', async function () {
    this.timeout(10000)
    const result = await getHtmlBody('Conrad_Martin', 'de')
    assert.ok(result.includes('src="https://upload.wikimedia.org'))
  })

  it('wiki links', async function () {
    this.timeout(10000)
    const result = await getHtmlBody('Conrad_Martin', 'de')
    assert.ok(result.includes('<a href="https://de.wikipedia.org/wiki'))
  })
})
