const assert = require('assert')

const { Question } = require('../dist/node/main.js')

describe('Package “@bldr/master-question”', function () {

  it('aliasForSubQuestions', function () {
    const questions = Question.parse({
      heading: 'Alias for `sub_questions`',
      questions: [
        {
          question: 'Questions Level 1',
          answer: 'Answer Level 1',
        }
      ]
    })
    assert.strictEqual(questions[0].subQuestions[0].question, 'Questions Level 1')
  })

  it('aliases', function () {
    const questions = Question.parse({
      h: 'h',
      s: [
        {
          q: 'q',
          a: 'a'
        }
      ]
    })
    assert.strictEqual(questions[0].heading, 'h')
    assert.strictEqual(questions[0].subQuestions[0].question, 'q')
    assert.strictEqual(questions[0].subQuestions[0].answer, 'a')
  })

  it('threeQuestions', function () {
    const questions = Question.parse([
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
    ])
    assert.strictEqual(questions.length, 3)
  })

  it('recursiveStructure', function () {
    const questions = Question.parse({
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
    })
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
    assert.strictEqual(questions[0].question, 'Markup support: <em>italic</em> <strong>bold</strong>')
    assert.strictEqual(questions[0].answer, 'Markup support: <em>italic</em> <strong>bold</strong>')
  })

  it('markupMultiLine', function () {
    const questions = Question.parse({
      question: '1. one\n2. two\n3. three\n',
      answer: '1. one\n2. two\n3. three\n'
    })
    assert.strictEqual(questions[0].question, 'one\ntwo\nthree')
    assert.strictEqual(questions[0].answer, '<ol>\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ol>\n')
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
