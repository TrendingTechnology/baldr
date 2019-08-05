const {
  assert,
  makeDOM
} = require('@bldr/test-helper')

const quote = require('@bldr/master-quote')

const render = function (data) {
  return quote.mainHTML({ masterData: data })
}

describe('Master slide “quote”: unit tests #unittest', () => {
  it('function “hookSetHTMLSlide()”: all values', () => {
    const html = render({
      text: 'text',
      author: 'author',
      date: 'date'
    })

    const doc = makeDOM(html)
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
    const html = render({
      text: 'text',
      date: 'date'
    })
    const doc = makeDOM(html)
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
    const html = render({
      text: 'text',
      author: 'author'
    })
    const doc = makeDOM(html)
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
    const html = render({
      text: 'text'
    })
    const doc = makeDOM(html)
    assert.equal(
      doc.querySelector('.attribution'),
      null
    )
  })
})
