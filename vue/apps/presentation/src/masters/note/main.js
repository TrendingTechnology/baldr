/**
 * @module @bldr/presentation/masters/note
 */

import { validateMasterSpec } from '../../lib/masters'
import { convertHtmlToPlainText } from '@bldr/string-format'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { buildTextStepController, wrapWords } from '@bldr/dom-manipulator'

export default validateMasterSpec({
  name: 'note',
  title: 'Hefteintrag',
  propsDef: {
    markup: {
      type: String,
      markup: true,
      description: 'Text im HTML- oder Markdown-Format oder als reiner Text.'
    }
  },
  icon: {
    name: 'master-note',
    color: 'blue'
  },
  styleConfig: {
    centerVertically: false,
    contentTheme: 'handwriting'
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = {
          markup: props
        }
      }

      props.markup = convertMarkdownToHtml(props.markup)

      // hr tag
      if (props.markup.indexOf('<hr>') > -1) {
        const segments = props.markup.split('<hr>')
        const prolog = segments.shift()
        let body = segments.join('<hr>')
        body = '<span class="word-area">' + wrapWords(body) + '</span>'
        props.markup = [prolog, body].join('')
        // No hr tag provided
        // Step through all words
      } else {
        props.markup = wrapWords(props.markup)
      }
      return props
    },
    calculateStepCount ({ props }) {
      return buildTextStepController(props.markup, { stepMode: 'words' })
        .stepCount
    },
    plainTextFromProps (props) {
      return convertHtmlToPlainText(props.markup)
    }
  }
})
