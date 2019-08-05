const {
  assert,
  makeDOM
} = require('@bldr/test-helper')

const markdown = require('@bldr/master-markdown')

const mainHTML = function (data) {
  return markdown.mainHTML({ masterData: data })
}

describe('Master slide “markdown” #unittest', () => {
  it('heading', () => {
    const result = mainHTML(`
# Heading 1

## Heading 2

### Heading 3`)

    const dom = makeDOM(result)
    assert.equal(dom.querySelector('h1').textContent, 'Heading 1')
    assert.equal(dom.querySelector('h2').textContent, 'Heading 2')
    assert.equal(dom.querySelector('h3').textContent, 'Heading 3')
  })

  it('list', () => {
    const result = mainHTML(`
* one
* two
* three`)
    const dom = makeDOM(result)
    assert.equal(dom.querySelector('ul li:nth-child(1)').textContent, 'one')
    assert.equal(dom.querySelector('ul li:nth-child(2)').textContent, 'two')
    assert.equal(dom.querySelector('ul li:nth-child(3)').textContent, 'three')
  })
})
