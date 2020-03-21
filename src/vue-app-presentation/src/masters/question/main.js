import { markupToHtml } from '@/lib.js'

class Question {

  constructor (spec, counts) {
    this.level = counts.level
    this.heading = null
    this.question = null
    this.questionNo = null
    this.answer = null
    this.answerNo = null
    this.subQuestions = null

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
        if (spec.hasOwnProperty(alias)) {
          spec[aliases[alias]] = spec[alias]
          delete spec[alias]
        }
      }
      for (const prop of ['heading', 'question', 'answer']) {
        if (spec[prop]) {
          if (typeof spec[prop] === 'string') {
            this[prop] = markupToHtml(spec[prop])
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
      if (spec.subQuestions) {
        this.subQuestions = []
        counts.level++
        Question.parseRecursively(spec.subQuestions, this.subQuestions, counts)
      }
    }
  }

  static parseRecursively (specs, processed = [], counts) {
    if (Array.isArray(specs)) {
      for (const spec of specs) {
        processed.push(new Question(spec, counts))
      }
      return processed
    }
    processed.push(new Question(specs, counts))
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
      answer: 0,
      level: 0
    }
  }
}

export default {
  title: 'Frage',
  props: {
    questions: {
      type: Array,
      description: 'Eine Liste mit Objekten mit den Schlüsseln `question` and `answer`.',
      required: true,
      markup: true
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
  normalizeProps (props) {
    const counts = Question.initCounts()
    const questions = Question.parseRecursively(props, [], counts)
    return { questions }
  }
}
