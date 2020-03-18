import { plainText } from '@bldr/core-browser'
import { markupToHtml } from '@/lib.js'
class Question {
  constructor (spec) {
    this.heading = null
    this.body = null
    this.answer = null
    this.subQuestions = null

    if (typeof spec === 'string') {
      this.body = spec
    } else if (typeof spec === 'object') {
      for (const prop of ['heading', 'body', 'answer']) {
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
        Question.parseRecursively(spec.subQuestions, this.subQuestions)
      }
    }
  }

  static parseRecursively (specs, processed = []) {
    if (Array.isArray(specs)) {
      const out = []
      for (const spec of specs) {
        return processed.push(new Questions(spec))
      }
    }
    processed.push(new Questions(specs))
    return processed
  }
}

const normalizeQAPair = function (pair) {
  if (typeof pair === 'string') {
    return { question: pair, answer: false }
  }
  if (typeof pair.question === 'string' && !pair.answer) {
    return { question: pair.question, answer: false }
  } else if (typeof pair.question === 'string' && typeof pair.answer === 'string') {
    return pair
  }
  throw new Error('Master slide “question”: Invalid data input')
}

const normalizeQuestions = function (questions) {
  if (Array.isArray(questions)) {
    const out = []
    for (const pair of questions) {
      out.push(normalizeQAPair(pair))
    }
    return out
  }
  return [normalizeQAPair(questions)]
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
    darkMode: true
  },
  normalizeProps (props) {
    if (typeof props === 'object' && !Array.isArray(props) && 'questions' in props) {
      props.questions = normalizeQuestions(props.questions)
      return props
    }
    return { questions: normalizeQuestions(props) }
  },
  calculateStepCount (props) {
    let count = 0
    for (const question of props.questions) {
      if ('answer' in question && question.answer) count += 1
    }
    return count + 1
  },
  plainTextFromProps (props) {
    const output = []
    if ('heading' in props && props.heading) output.push(plainText(props.heading))
    for (const question of props.questions) {
      output.push(plainText(question.question))
      if ('answer' in question && question.answer) output.push(plainText(question.answer))
    }
    return output.join(' | ')
  }
}
