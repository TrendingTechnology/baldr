/**
 * @module @bldr/lamp/masters/question
 */

import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { convertHtmlToPlainText } from '@bldr/core-browser'
import steps from '@/steps.js'

/**
 * We want no lists `<ol>` etc in the HTML output for the question and the
 * heading. `1. act` is convert my `marked` into those lists. This is a
 * quick and dirty hack. Disable some renderer
 * https://marked.js.org/#/USING_PRO.md may be better.
 */
function convertMarkdownToHtmlNoLists (text) {
  text = convertMarkdownToHtml(text)
  // <ol start="2">
  text = text.replace(/<\/?(ul|ol|li)[^>]*?>/g, '')
  return text.trim()
}

/**
 * A questions with sub questions.
 */
class Question {
  constructor (spec, counts, level) {
    /**
     * @type {Number}
     */
    this.level = null

    /**
     * @type {String}
     */
    this.heading = null

    /**
     * @type {String}
     */
    this.question = null

    /**
     * @type {Number}
     */
    this.questionNo = null

    /**
     * @type {String}
     */
    this.answer = null

    /**
     * @type {Number}
     */
    this.answerNo = null

    /**
     * @type {Array}
     */
    this.subQuestions = null

    /**
     * @type {Object}
     */
    this.counts = counts

    const aliases = {
      q: 'question',
      a: 'answer',
      h: 'heading',
      s: 'subQuestions'
    }

    if (typeof spec === 'string') {
      counts.question++
      this.questionNo = counts.question
      counts.sequence.push(`q${counts.question}`)
      this.question = spec
    } else if (typeof spec === 'object') {
      // aliases
      for (const alias in aliases) {
        if (spec[alias]) {
          spec[aliases[alias]] = spec[alias]
          delete spec[alias]
        }
      }
      for (const prop of ['heading', 'question', 'answer']) {
        if (spec[prop]) {
          if (typeof spec[prop] === 'string') {
            // list are allowed
            if (spec[prop] === 'answer') {
              this[prop] = convertMarkdownToHtml(spec[prop])
            // no lists are allowed
            } else {
              this[prop] = convertMarkdownToHtmlNoLists(spec[prop])
            }
          } else {
            throw new Error(`Unsupported type for questions ${prop} ${spec[prop]}`)
          }
        }
      }
      if (this.question) {
        counts.question++
        counts.sequence.push(`q${counts.question}`)
        this.questionNo = counts.question
      }
      if (this.answer) {
        counts.answer++
        counts.sequence.push(`a${counts.answer}`)
        this.answerNo = counts.answer
      }
      if (this.question) {
        this.level = level + 1
      } else {
        // Question object without a question. Only a heading
        this.level = level
      }
      if (spec.questions) {
        spec.subQuestions = spec.questions
        delete spec.questions
      }
      if (spec.subQuestions) {
        this.subQuestions = []
        Question.parseRecursively(spec.subQuestions, this.subQuestions, counts, this.level)
      }
    }
  }

  /**
   * `['q1', 'a1', 'q2', 'q3']`
   *
   * @type {Array}
   */
  get sequence () {
    return this.counts.sequence
  }

  /**
   * @type {Number}
   */
  get stepCount () {
    return this.sequence.length
  }

  /**
   * heading + question without answer.
   *
   * @returns {String}
   */
  get questionText () {
    let output = ''
    if (this.heading) output = output + this.heading
    if (this.question) output = output + this.question
    return output
  }

  /**
   * @param {*} specs
   * @param {*} processed
   * @param {*} counts
   * @param {Number} level
   */
  static parseRecursively (specs, processed, counts, level) {
    if (Array.isArray(specs)) {
      for (const spec of specs) {
        processed.push(new Question(spec, counts, level))
      }
      return processed
    }
    processed.push(new Question(specs, counts, level))
    return processed
  }

  /**
   * sequence: `['q1', 'a1', 'q2', 'q3']`
   *
   * @returns {Object}
   */
  static initCounts () {
    return {
      sequence: [],
      question: 0,
      answer: 0
    }
  }
}

/**
 * @param {Number} stepNo
 */
function setQuestionsByStepNo (stepNo) {
  const slides = this.$get('slides')
  const slide = slides[this.navNos.slideNo - 1]
  // ['q1', 'a1', 'q2', 'q3']
  const sequence = slide.props.sequence

  // Question with a question or answer. Only the heading.
  if (!sequence.length) return

  // q1 or a1
  const curId = sequence[stepNo - 1]

  for (const id of sequence) {
    const element = this.$el.querySelector(`#${id}`)
    if (element) element.classList.remove('active')
  }

  const isAnswer = curId.match(/^a/)
  const element = this.$el.querySelector(`#${curId}`)
  if (!element) return
  element.classList.add('active')
  if (isAnswer) {
    const answerNo = parseInt(curId.substr(1))
    this.domSteps.displayByNo({ stepNo: answerNo + 1, full: true })
  }
  if (stepNo === 1) {
    window.scrollTo(0, 0)
  } else {
    element.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
}

/**
 * Collection all question text (without answers) to build the plain
 * text version.
 *
 * @param {String} text
 * @param {module:@bldr/lamp/masters/question~Question[]} questions
 *
 * @returns {String}
 */
function collectText (text, questions) {
  for (const question of questions) {
    text = text + question.questionText + ' | '
    if (question.subQuestions) {
      text = collectText(text, question.subQuestions)
    }
  }
  return text
}

export default {
  title: 'Frage',
  props: {
    questions: {
      type: Array,
      description: 'Eine Liste mit Objekten mit den Schlüsseln `question` and `answer`.',
      required: true,
      markup: true
    },
    sequence: {
      description: 'Wird automatisch erzeugt, z. B.: [\'q1\', \'a1\', \'q2\', \'q3\'] .',
      type: Array
    }
  },
  icon: {
    name: 'comment-question',
    color: 'yellow',
    size: 'large'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  hooks: {
    normalizeProps (props) {
      const counts = Question.initCounts()
      const questions = Question.parseRecursively(props, [], counts, 0)
      return {
        questions,
        sequence: questions[0].sequence
      }
    },
    calculateStepCount ({ props }) {
      const firstQuestion = props.questions[0]
      return firstQuestion.stepCount
    },
    afterSlideNoChangeOnComponent () {
      this.domSteps = new steps.DomSteps({
        elements: this.$el.querySelectorAll('.answer'),
        rootElement: this.$el
      })
    },
    afterStepNoChangeOnComponent ({ newStepNo }) {
      setQuestionsByStepNo.call(this, newStepNo)
    },
    plainTextFromProps (props) {
      return convertHtmlToPlainText(collectText('', props.questions))
    }
  }
}
