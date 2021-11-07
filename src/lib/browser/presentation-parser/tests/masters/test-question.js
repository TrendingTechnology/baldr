/* globals describe it */

const assert = require('assert')

const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/question')

function getQuestions (no) {
  return presentation.getSlideByNo(no).fields.questions
}

describe('Master question', function () {
  it('Alias for sub_questions', function () {
    const questions = getQuestions(1)
    assert.strictEqual(
      questions[0].subQuestions[0].question,
      'Questions Level 1'
    )
  })

  it('Aliases', function () {
    const questions = getQuestions(2)
    assert.strictEqual(questions[0].heading, 'h')
    assert.strictEqual(questions[0].subQuestions[0].question, 'q')
    assert.strictEqual(questions[0].subQuestions[0].answer, 'a')
  })

  it('Three questions', function () {
    const questions = getQuestions(3)
    assert.strictEqual(questions.length, 3)
  })

  it('Recursive structure', function () {
    const questions = getQuestions(4)
    assert.strictEqual(
      questions[0].subQuestions[0].subQuestions[0].subQuestions[0].question,
      'Questions Level 3'
    )
  })

  it('Markup support in short form', function () {
    const questions = getQuestions(5)
    assert.strictEqual(
      questions[0].question,
      'Markup support: <em>italic</em> <strong>bold</strong>'
    )
    assert.strictEqual(
      questions[0].answer,
      'Markup support: <em>italic</em> <strong>bold</strong>'
    )
  })

  it('Markup multiline', function () {
    const questions = getQuestions(16)
    assert.strictEqual(questions[0].question, 'one\ntwo\nthree')
    assert.strictEqual(
      questions[0].answer,
      '<ol>\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ol>\n'
    )
  })

  it('Heading', function () {
    const questions = getQuestions(7)
    assert.strictEqual(questions[0].heading, 'Questions about the text')
  })

  it('Questions as string', function () {
    const questions = getQuestions(11)
    assert.strictEqual(questions[0].question, 'Question one?')
    assert.strictEqual(questions[1].question, 'Question two?')
    assert.strictEqual(questions[2].question, 'Question three?')
  })

  it('One question as string', function () {
    const questions = getQuestions(12)
    assert.strictEqual(questions[0].question, 'One big question?')
  })

  describe('Function “generateTexMarkup”', function () {
    it('threeQuestions', function () {
      const slide = presentation.getSlideByNo(3)
      assert.strictEqual(
        slide.master.generateTexMarkup(slide.fields),
        `\\begin{enumerate}
\\item

Question one?

\\textit{Answer one}

\\item

Question two?

\\textit{Answer two}

\\item

Question three?

\\textit{Answer three}
\\end{enumerate}`
      )
    })

    it.skip('recursiveStructure', function () {
      const slide = presentation.getSlideByNo(4)
      assert.strictEqual(
        slide.master.generateTexMarkup(slide.fields),
        `\\begin{enumerate}
\\item

\\textbf{Heading}

\\begin{enumerate}
\\item

Questions Level 1

\\textit{Answer Level 1}

\\begin{enumerate}
\\item

Questions Level 2

\\textit{Answer Level 2}

\\begin{enumerate}
\\item

Questions Level 3

\\textit{Answer Level 3}
\\end{enumerate}
\\end{enumerate}
\\end{enumerate}
\\end{enumerate}`
      )
    })
  })
})
