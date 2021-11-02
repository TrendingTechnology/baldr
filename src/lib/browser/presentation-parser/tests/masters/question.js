/* globals describe it */

const assert = require('assert')

const {
  Question,
  generateTexMarkup
} = require('../../dist/node/masters/question')

const { parseMasterPresentation } = require('../_helper.js')

const threeQuestions = [
  {
    question: 'Question one?',
    answer: 'Answer one'
  },
  {
    question: 'Question two?',
    answer: 'Answer two'
  },
  {
    question: 'Question three?',
    answer: 'Answer three'
  }
]

const threeQuestionsTex = `\\begin{enumerate}
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

const recursiveStructure = {
  heading: 'Heading',
  subQuestions: [
    {
      question: 'Questions Level 1',
      answer: 'Answer Level 1',
      subQuestions: [
        {
          question: 'Questions Level 2',
          answer: 'Answer Level 2',
          subQuestions: [
            {
              question: 'Questions Level 3',
              answer: 'Answer Level 3'
            }
          ]
        }
      ]
    }
  ]
}

const recursiveStructureTex = `\\begin{enumerate}
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

const presentation = parseMasterPresentation('question')

function getQuestions (no) {
  return presentation.getSlideByNo(no).fields.questions
}

describe('Master question', function () {
  describe('Class “Question”', function () {
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

    it('recursiveStructure', function () {
      const questions = Question.parse(recursiveStructure)
      assert.strictEqual(
        questions[0].subQuestions[0].subQuestions[0].subQuestions[0].question,
        'Questions Level 3'
      )
    })

    it('markupShort', function () {
      const questions = Question.parse({
        question: 'Markup support: *italic* **bold**',
        answer: 'Markup support: *italic* **bold**'
      })
      assert.strictEqual(
        questions[0].question,
        'Markup support: <em>italic</em> <strong>bold</strong>'
      )
      assert.strictEqual(
        questions[0].answer,
        'Markup support: <em>italic</em> <strong>bold</strong>'
      )
    })

    it('markupMultiLine', function () {
      const questions = Question.parse({
        question: '1. one\n2. two\n3. three\n',
        answer: '1. one\n2. two\n3. three\n'
      })
      assert.strictEqual(questions[0].question, 'one\ntwo\nthree')
      assert.strictEqual(
        questions[0].answer,
        '<ol>\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ol>\n'
      )
    })

    it('heading', function () {
      const questions = Question.parse({
        heading: 'Questions about the text',
        questions: [
          {
            question: 'Question one?',
            answer: 'Answer one'
          }
        ]
      })
      assert.strictEqual(questions[0].heading, 'Questions about the text')
    })

    it('questionsAsString', function () {
      const questions = Question.parse([
        'Question one?',
        'Question two?',
        'Question three?'
      ])
      assert.strictEqual(questions[0].question, 'Question one?')
      assert.strictEqual(questions[1].question, 'Question two?')
      assert.strictEqual(questions[2].question, 'Question three?')
    })

    it('oneQuestionAsString', function () {
      const questions = Question.parse('One big question?')
      assert.strictEqual(questions[0].question, 'One big question?')
    })
  })

  describe('Function “generateTexMarkup”', function () {
    it('threeQuestions', function () {
      const questions = Question.parse(threeQuestions)
      assert.strictEqual(generateTexMarkup(questions), threeQuestionsTex)
    })

    it.skip('recursiveStructure', function () {
      const questions = Question.parse(recursiveStructure)
      assert.strictEqual(generateTexMarkup(questions), recursiveStructureTex)
    })
  })
})
