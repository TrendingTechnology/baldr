/**
 * @module @bldr/lamp/masters/question
 */

import { validateMasterSpec } from '@bldr/lamp-core'
import { convertHtmlToPlainText } from '@bldr/string-format'
import { question } from '@bldr/presentation-parser'
import { buildQuestionStepController } from '@bldr/dom-manipulator'

/**
 * @param {Number} stepNo
 */
function setQuestionsByStepNo (stepNo) {
  const slides = this.$get('slides')
  const slide = slides[this.navNos.slideNo - 1]
  // ['q1', 'a1', 'q2', 'q3']
  const sequence = slide.props.sequence

  // Question without a question or answer. Only the heading.
  if (sequence.length === 0) {
    return
  }

  // q1 or a1
  const curId = sequence[stepNo - 1]

  for (const id of sequence) {
    const element = this.$el.querySelector(`#${id}`)
    if (element != null) {
      element.classList.remove('active')
    }
  }

  const isAnswer = curId.match(/^a/)
  const element = this.$el.querySelector(`#${curId}`)
  if (element == null) {
    return
  }
  element.classList.add('active')
  if (isAnswer != null) {
    const answerNo = parseInt(curId.substr(1))
    this.stepController.showUpTo(answerNo + 1)
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

export default validateMasterSpec({
  name: 'question',
  title: 'Frage',
  propsDef: {
    questions: {
      type: Array,
      description:
        'Eine Liste mit Objekten mit den Schlüsseln `question` and `answer`.',
      required: true,
      markup: true
    },
    sequence: {
      description:
        "Wird automatisch erzeugt, z. B.: ['q1', 'a1', 'q2', 'q3'] .",
      type: Array
    }
  },
  icon: {
    name: 'question',
    color: 'yellow',
    size: 'large'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  hooks: {
    normalizeProps (props) {
      const questions = question.Question.parse(props)
      return {
        questions,
        sequence: questions[0].sequence
      }
    },
    calculateStepCount ({ props }) {
      const firstQuestion = props.questions[0]
      return firstQuestion.stepCount
    },
    generateTexMarkup ({ props }) {
      return question.generateTexMarkup(props)
    },
    afterSlideNoChangeOnComponent () {
      this.stepController = buildQuestionStepController(this.$el)
      this.stepController.hideAll()
    },
    afterStepNoChangeOnComponent ({ newStepNo }) {
      setQuestionsByStepNo.call(this, newStepNo)
    },
    plainTextFromProps (props) {
      return convertHtmlToPlainText(collectText('', props.questions))
    }
  }
})
