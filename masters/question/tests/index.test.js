const {
  assert,
  makeDOM,
  rewire,
  freshEnv,
  requireFile,
  packageFilePath
} = require('@bldr/test-helper')

const question = require('@bldr/master-question')
const questionRewired = rewire(packageFilePath('@bldr/master-question', 'index.js'))

const normalizeData = function (data) {
  return question.normalizeData(data)
}

const mainHTML = function (data) {
  const masterData = question.normalizeData(data)
  return question.mainHTML({ masterData: masterData })
}

const dataSingleWithout = 'One?'
const dataSingleWithAnswer = { question: 'One?', answer: 'One' }

const dataMultipleWithout = ['One?', 'Two?']
const dataMultipleWithAnswer = [
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
    const html = templatQAPair('question', 'answer')
    const dom = makeDOM(html)
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
    const html = templatQAPair('question', '')
    const dom = makeDOM(html)
    assert.equal(
      dom.querySelector('.answer'),
      null
    )
  })

  it('Method “mainHTML()”: dataSingleWithout', () => {
    const html = mainHTML(dataSingleWithout)
    const dom = makeDOM(html)
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
    const html = mainHTML(dataSingleWithAnswer)
    const dom = makeDOM(html)
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
    const html = mainHTML(dataMultipleWithout)
    const dom = makeDOM(html)
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
    const html = mainHTML(dataMultipleWithAnswer)
    const dom = makeDOM(html)
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
    const { Slide } = requireFile('@bldr/core', 'slides.js')

    const getQuestion = function () {
      return new Slide({ question: ['1', '2', '3'] }, freshEnv())
    }

    it('Property “this.visited', () => {
      const question = getQuestion(['1', '2', '3'])
      assert.equal(question.steps.visited, false)
      question.set()
      assert.equal(question.steps.visited, true)
    })

    it('Property “this.steps.count', () => {
      const question = getQuestion(['1', '2', '3'])
      question.set()
      assert.equal(question.steps.count, 3)
    })

    it('Property “this.steps.stepData', () => {
      const question = getQuestion(['1', '2', '3'])
      question.set()
      assert.equal(question.steps.stepData[1].tagName, 'P')
      assert.equal(question.steps.stepData[2].tagName, 'P')
      assert.equal(question.steps.stepData[3].tagName, 'P')
    })

    it('Method “steps.next()”', () => {
      const question = getQuestion(['1', '2', '3'])
      question.set()
      const q1 = question.env.document.querySelector('li:nth-child(1) .question')
      const q2 = question.env.document.querySelector('li:nth-child(2) .question')
      const q3 = question.env.document.querySelector('li:nth-child(3) .question')

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
      const question = getQuestion(['1', '2', '3'])
      question.set()

      const q1 = question.env.document.querySelector('li:nth-child(1) .question')
      const q2 = question.env.document.querySelector('li:nth-child(2) .question')
      const q3 = question.env.document.querySelector('li:nth-child(3) .question')

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
