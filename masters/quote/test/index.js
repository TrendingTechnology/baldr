const {
  assert,
  makeDOM
} = require('baldr-test')

const quote = require('../index.js')

let render = function (data) {
  return quote.mainHTML({ masterData: data })
}

describe('Master slide “quote”: unit tests #unittest', () => {
  it('function “hookSetHTMLSlide()”: all values', () => {
    let html = render({
      text: 'text',
      author: 'author',
      date: 'date'
    })

    let doc = makeDOM(html)
    assert.ok(html.includes('text'))
    assert.equal(
      doc.querySelector('.text').textContent,
      '» text «'
    )
    assert.equal(
      doc.querySelector('#quotation-begin').textContent,
      '»'
    )
    assert.equal(
      doc.querySelector('#quotation-end').textContent,
      '«'
    )
    assert.equal(
      doc.querySelector('.attribution').textContent,
      'author, date'
    )
    assert.equal(
      doc.querySelector('.author').textContent,
      'author'
    )
    assert.equal(
      doc.querySelector('.date').textContent,
      'date'
    )
  })

  it('function “hookSetHTMLSlide()”: no author', () => {
    let html = render({
      text: 'text',
      date: 'date'
    })
    let doc = makeDOM(html)
    assert.equal(
      doc.querySelector('.date').textContent,
      'date'
    )
    assert.equal(
      doc.querySelector('.author'),
      null
    )
  })

  it('function “hookSetHTMLSlide()”: no date', () => {
    let html = render({
      text: 'text',
      author: 'author'
    })
    let doc = makeDOM(html)
    assert.equal(
      doc.querySelector('.author').textContent,
      'author'
    )
    assert.equal(
      doc.querySelector('.date'),
      null
    )
  })

  it('function “hookSetHTMLSlide()”: only text', () => {
    let html = render({
      text: 'text'
    })
    let doc = makeDOM(html)
    assert.equal(
      doc.querySelector('.attribution'),
      null
    )
  })
})
