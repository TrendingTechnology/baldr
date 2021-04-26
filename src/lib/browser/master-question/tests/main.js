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
    const questions = Question.init(aliases)
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

  const markupMultiLine = {
    question: 'Markup support: *multiline*',
    answer: '* one\n* two\n* three\n'
  }

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
    const questions = Question.init(questionsAsString)
    assert.strictEqual(questions[0].question, 'Question one?')
    assert.strictEqual(questions[1].question, 'Question two?')
    assert.strictEqual(questions[2].question, 'Question three?')
  })

  const oneQuestionAsString = 'One big question?'

  it('oneQuestionAsString', function () {
    const questions = Question.init(oneQuestionAsString)
    assert.strictEqual(questions[0].question, 'One big question?')
  })
})
