const assert = require('assert')

const { Question } = require('../dist/node/main.js')

describe('Package “@bldr/master-question”', function () {

  const aliasForSubQuestions = {
    heading: 'Alias for `sub_questions`',
    questions: [
      {
        question: 'Questions Level 1',
        answer: 'Answer Level 1',
        questions: [
          {
            question: 'Questions Level 2',
            answer: 'Answer Level 2',
            questions: [
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

  const aliases = {
    h: 'h',
    s: [
      {
        q: 'q',
        a: 'a'
      }
    ]
  }

  it('aliases', function () {
    const questions = Question.parse(aliases)
    assert.strictEqual(questions[0].heading, 'h')
    assert.strictEqual(questions[0].subQuestions[0].question, 'q')
    assert.strictEqual(questions[0].subQuestions[0].answer, 'a')
  })

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

  const markupShort = {
    question: 'Markup support: *italic* **bold**',
    answer: 'Markup support: *italic* **bold**'
  }

  it('markupShort', function () {
    const questions = Question.parse(markupShort)
    assert.strictEqual(questions[0].question, 'Markup support: <em>italic</em> <strong>bold</strong>')
    assert.strictEqual(questions[0].answer, 'Markup support: <em>italic</em> <strong>bold</strong>')
  })

  const markupMultiLine = {
    question: '1. one\n2. two\n3. three\n',
    answer: '1. one\n2. two\n3. three\n'
  }

  it('markupMultiLine', function () {
    const questions = Question.parse(markupMultiLine)
    assert.strictEqual(questions[0].question, 'one\ntwo\nthree')
    assert.strictEqual(questions[0].answer, '<ol>\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ol>\n')
  })

  const heading = {
    heading: 'Questions about the text',
    questions: [
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
  }

  const questionsAsString = [
    'Question one?',
    'Question two?',
    'Question three?'
  ]

  it('questionsAsString', function () {
    const questions = Question.parse(questionsAsString)
    assert.strictEqual(questions[0].question, 'Question one?')
    assert.strictEqual(questions[1].question, 'Question two?')
    assert.strictEqual(questions[2].question, 'Question three?')
  })

  const oneQuestionAsString = 'One big question?'

  it('oneQuestionAsString', function () {
    const questions = Question.parse(oneQuestionAsString)
    assert.strictEqual(questions[0].question, 'One big question?')
  })
})
