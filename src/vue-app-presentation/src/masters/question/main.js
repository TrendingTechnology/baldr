import { markupToHtml } from '@/lib.js'

class Question {
  constructor (spec, level) {
    this.level = level
    this.heading = null
    this.question = null
    this.answer = null
    this.subQuestions = null

    if (typeof spec === 'string') {
      this.question = spec
    } else if (typeof spec === 'object') {
      for (const prop of ['heading', 'question', 'answer']) {
        if (spec[prop]) {
          if (typeof spec[prop] === 'string') {
            this[prop] = markupToHtml(spec[prop])
          } else {
            throw new Error(`Unsupported type for questions ${prop} ${spec[prop]}`)
          }
        }
      }
      if (spec.subQuestions) {
        this.subQuestions = []
        Question.parseRecursively(spec.subQuestions, this.subQuestions, level + 1)
      }
    }
  }

  static parseRecursively (specs, processed = [], level = 0) {
    if (Array.isArray(specs)) {
      for (const spec of specs) {
        processed.push(new Question(spec, level))
      }
      return processed
    }
    processed.push(new Question(specs, level))
    return processed
  }
}

export default {
  title: 'Frage',
  props: {
    heading: {
      type: String,
      description: 'Eine Überschrift, die über den Fragen angezeigt wird.',
      markup: true
    },
    questions: {
      type: Array,
      description: 'Eine Liste mit Objekten mit den Schlüsseln `question` and `answer`.',
      required: true,
      markup: true
    },
    numbers: {
      type: Boolean,
      description: 'Ob die Fragen nummeriert werden sollen.',
      default: true
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
    const questions = Question.parseRecursively(props)
    return { questions }
  }
}
