/* globals describe it */

const assert = require('assert')

const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/note')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getMarkup (ref) {
  const slide = getSlide(ref)
  return slide.fields.markup
}

describe('Master slide “note”', function () {
  it('with-steps', function () {
    const markup = getMarkup('with-steps')
    assert.strictEqual(
      markup,
      '<h1 id="heading-1">heading 1</h1>\n<span class="word-area"><ul> <li><span class="word">one</span> <span class="word">two</span> <span class="word">three</span></li> <li><span class="word">one</span> <span class="word">two</span> <span class="word">three</span></li> </ul> <p><span class="word">lorem</span> <span class="word">ipsum</span></p> </span>'
    )
  })

  it('no-steps', function () {
    const markup = getMarkup('no-steps')
    assert.strictEqual(
      markup,
      '<span class="word">lorem</span> <span class="word">ipsum</span>'
    )
  })

  it('no-steps-after-hr', function () {
    const markup = getMarkup('no-steps-after-hr')
    assert.strictEqual(
      markup,
      '<h1 id="no-steps">No steps</h1>\n<span class="word-area"></span>'
    )
  })

  it('heading-underline', function () {
    const markup = getMarkup('heading-underline')
    assert.strictEqual(
      markup,
      '<h1 id="heading-1">heading 1</h1>\n<span class="word-area"><p><span class="word">one</span></p> <h2 id="heading-2-test-underline"><span class="word">heading</span> <span class="word">2</span> <span class="word">test</span> <span class="word">underline</span></h2> <p><span class="word">two</span></p> <h3 id="heading-3-test-underline"><span class="word">heading</span> <span class="word">3</span> <span class="word">test</span> <span class="word">underline</span></h3> <p><span class="word">three</span></p> </span>'
    )
  })

  it('multiple-horizonal-rules', function () {
    const markup = getMarkup('multiple-horizonal-rules')
    assert.strictEqual(
      markup,
      '<h1 id="heading-1">heading 1</h1>\n<span class="word-area"><p><span class="word">one</span></p> <hr> <p><span class="word">two</span></p> <hr> <p><span class="word">three</span></p> </span>'
    )
  })

  it('Steps', function () {
    const slide = getSlide('with-steps')
    assert.strictEqual(slide.steps[0].title, 'Initiale Ansicht')
    assert.strictEqual(slide.steps[1].title, 'one')
    assert.strictEqual(slide.steps.length, 9)

  })
})
