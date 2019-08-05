const {
  assert,
  returnDOM
} = require('@bldr/test-helper')
const path = require('path')
let rewire
let document

describe.skip('“render.js” #unittest', function () {
  beforeEach(() => {
    rewire = require('rewire')(path.join(__dirname, '..', 'src', 'electron-app', 'electron-render.js'))
    document = returnDOM()
    rewire.__set__('document', document)
  })

  it('“Function toggleModal()”', () => {
    const toggleModal = rewire.__get__('toggleModal')
    const modal = document.getElementById('modal')

    assert.equal(toggleModal(), 'block')
    assert.equal(modal.style.display, 'block')

    assert.equal(toggleModal(), 'none')
    assert.equal(modal.style.display, 'none')

    assert.equal(toggleModal(), 'block')
    assert.equal(modal.style.display, 'block')
  })

  it('Function “errorPage()”', () => {
    const errorPage = rewire.__get__('errorPage')
    const error = {
      stack: 'stack'
    }
    errorPage('message', 'source', 'lineNo', 'colNo', error)
    const getText = function (selector) {
      return document.querySelector(selector).textContent
    }
    assert.equal(getText('#slide p:nth-child(1)'), 'message')
    assert.equal(getText('#slide p:nth-child(2)'), 'Source: source')
    assert.equal(getText('#slide p:nth-child(3)'), 'Line number: lineNo')
    assert.equal(getText('#slide p:nth-child(4)'), 'Column number: colNo')
    assert.equal(getText('#slide pre'), 'stack')
  })
})
