/**
 * @module @bldr/lamp/masters/question
 */

import { validateMasterSpec } from '../../lib/masters'
import { convertHtmlToPlainText } from '@bldr/string-format'
import { questionMModul } from '@bldr/presentation-parser'

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
      const questions = questionMModul.Question.parse(props)
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
      return questionMModul.generateTexMarkup(props)
    },
    plainTextFromProps (props) {
      return convertHtmlToPlainText(questionMModul.collectPlainText('', props.questions))
    }
  }
})
