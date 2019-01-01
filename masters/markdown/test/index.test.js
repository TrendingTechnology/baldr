const {
  assert,
  makeDOM
} = require('@bldr/test-helper')

const markdown = require('../index.js')

let mainHTML = function (data) {
  return markdown.mainHTML({ masterData: data })
}

describe('Master slide “markdown” #unittest', () => {
  it('heading', () => {
    let result = mainHTML(`
# Heading 1

## Heading 2

### Heading 3`)

    let dom = makeDOM(result)
    assert.equal(dom.querySelector('h1').textContent, 'Heading 1')
    assert.equal(dom.querySelector('h2').textContent, 'Heading 2')
    assert.equal(dom.querySelector('h3').textContent, 'Heading 3')
  })

  it('list', () => {
    let result = mainHTML(`
* one
* two
* three`)
    let dom = makeDOM(result)
    assert.equal(dom.querySelector('ul li:nth-child(1)').textContent, 'one')
    assert.equal(dom.querySelector('ul li:nth-child(2)').textContent, 'two')
    assert.equal(dom.querySelector('ul li:nth-child(3)').textContent, 'three')
  })
})
