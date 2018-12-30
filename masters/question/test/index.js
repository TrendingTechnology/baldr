const {
  assert,
  makeDOM,
  rewire,
  srcPath,
  path,
  freshEnv
} = require('@bldr/test-helper')

const question = require('../index.js')
const questionRewired = rewire(path.join(__dirname, '..', 'index.js'))

let normalizeData = function (data) {
  return question.normalizeData(data)
}

let mainHTML = function (data) {
  let masterData = question.normalizeData(data)
  return question.mainHTML({ masterData: masterData })
}

let dataSingleWithout = 'One?'
let dataSingleWithAnswer = { question: 'One?', answer: 'One' }

let dataMultipleWithout = ['One?', 'Two?']
let dataMultipleWithAnswer = [
  { question: 'One?', answer: 'One' },
  { question: 'Two?', answer: 'Two' }
]

describe('Master slide “question” #unittest', () => {
  it('method “normalizeData()”', () => {
    assert.deepEqual(
      normalizeData(dataSingleWithout),
      [{ question: 'One?', answer: false }]
    )

    assert.deepEqual(
      normalizeData(dataSingleWithAnswer),
      [{ question: 'One?', answer: 'One' }]
    )

    assert.deepEqual(
      normalizeData(dataMultipleWithout),
      [
        { question: 'One?', answer: false },
        { question: 'Two?', answer: false }
      ]
    )

    assert.deepEqual(
      normalizeData(dataMultipleWithAnswer),
      [
        { question: 'One?', answer: 'One' },
        { question: 'Two?', answer: 'Two' }
      ]
    )

    assert.throws(function () { normalizeData(false) })
    assert.throws(function () { normalizeData(true) })
    assert.throws(function () { normalizeData({ lol: 'lol', troll: 'troll' }) })
  })

  it('Method “templatQAPair()”', () => {
    const templatQAPair = questionRewired.__get__('templatQAPair')
    let html = templatQAPair('question', 'answer')
    let dom = makeDOM(html)
    assert.equal(
      dom.querySelector('.question').textContent,
      'question'
    )
    assert.equal(
      dom.querySelector('.answer').textContent,
      'answer'
    )
  })

  it('Method “templatQAPair()”: answer empty string', () => {
    const templatQAPair = questionRewired.__get__('templatQAPair')
    let html = templatQAPair('question', '')
    let dom = makeDOM(html)
    assert.equal(
      dom.querySelector('.answer'),
      null
    )
  })

  it('Method “mainHTML()”: dataSingleWithout', () => {
    let html = mainHTML(dataSingleWithout)
    let dom = makeDOM(html)
    assert.equal(
      dom.querySelector('.question').textContent,
      'One?'
    )
    assert.equal(
      dom.querySelector('.answer'),
      null
    )
  })

  it('Method “mainHTML()”: dataSingleWithAnswer', () => {
    let html = mainHTML(dataSingleWithAnswer)
    let dom = makeDOM(html)
    assert.equal(
      dom.querySelector('.question').textContent,
      'One?'
    )
    assert.equal(
      dom.querySelector('.answer').textContent,
      'One'
    )
  })

  it('Method “mainHTML()”: dataMultipleWithout', () => {
    let html = mainHTML(dataMultipleWithout)
    let dom = makeDOM(html)
    assert.equal(
      dom.querySelector('ol li:nth-child(1) p.question').textContent,
      'One?'
    )
    assert.equal(
      dom.querySelector('ol li:nth-child(2) p.answer'),
      null
    )
  })

  it('Method “mainHTML()”: dataMultipleWithAnswer', () => {
    let html = mainHTML(dataMultipleWithAnswer)
    let dom = makeDOM(html)
    assert.equal(
      dom.querySelector('ol li:nth-child(1) p.question').textContent,
      'One?'
    )
    assert.equal(
      dom.querySelector('ol li:nth-child(2) p.answer').textContent,
      'Two'
    )
  })

  describe('Step support', () => {
    let slidesJsPath = srcPath('app', 'slides.js')
    const { Slide } = require(slidesJsPath)

    let getQuestion = function () {
      return new Slide({ 'question': ['1', '2', '3'] }, freshEnv())
    }

    it('Property “this.visited', () => {
      let question = getQuestion(['1', '2', '3'])
      assert.equal(question.steps.visited, false)
      question.set()
      assert.equal(question.steps.visited, true)
    })

    it('Property “this.steps.count', () => {
      let question = getQuestion(['1', '2', '3'])
      question.set()
      assert.equal(question.steps.count, 3)
    })

    it('Property “this.steps.stepData', () => {
      let question = getQuestion(['1', '2', '3'])
      question.set()
      assert.equal(question.steps.stepData[1].tagName, 'P')
      assert.equal(question.steps.stepData[2].tagName, 'P')
      assert.equal(question.steps.stepData[3].tagName, 'P')
    })

    it('Method “steps.next()”', () => {
      let question = getQuestion(['1', '2', '3'])
      question.set()
      let q1 = question.env.document.querySelector('li:nth-child(1) .question')
      let q2 = question.env.document.querySelector('li:nth-child(2) .question')
      let q3 = question.env.document.querySelector('li:nth-child(3) .question')

      assert.equal(question.steps.no, 1)
      assert.equal(q1.style.visibility, 'visible')
      assert.equal(q2.style.visibility, 'hidden')
      assert.equal(q3.style.visibility, 'hidden')

      question.steps.next()
      assert.equal(question.steps.no, 2)
      assert.equal(q2.style.visibility, 'visible')

      question.steps.next()
      assert.equal(question.steps.no, 3)
      assert.equal(q3.style.visibility, 'visible')

      question.steps.next()
      assert.equal(question.steps.no, 1)
      assert.equal(q1.style.visibility, 'visible')
    })

    it('Method “steps.prev()”', () => {
      let question = getQuestion(['1', '2', '3'])
      question.set()

      let q1 = question.env.document.querySelector('li:nth-child(1) .question')
      let q2 = question.env.document.querySelector('li:nth-child(2) .question')
      let q3 = question.env.document.querySelector('li:nth-child(3) .question')

      assert.equal(question.steps.no, 1)
      assert.equal(q1.style.visibility, 'visible')
      assert.equal(q2.style.visibility, 'hidden')
      assert.equal(q3.style.visibility, 'hidden')

      question.steps.prev()
      assert.equal(question.steps.no, 3)
      assert.equal(q1.style.visibility, 'visible')
      assert.equal(q2.style.visibility, 'visible')
      assert.equal(q3.style.visibility, 'visible')

      question.steps.prev()
      assert.equal(question.steps.no, 2)

      question.steps.prev()
      assert.equal(question.steps.no, 1)
    })
  })
})
