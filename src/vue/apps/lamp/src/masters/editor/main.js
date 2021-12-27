/**
 * @module @bldr/lamp/masters/editor
 */

import { convertHtmlToPlainText } from '@bldr/string-format'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { validateMasterSpec } from '../../lib/masters'
import { mapStepFieldDefintionsToProps } from '@bldr/presentation-parser'
import { buildTextStepController, wrapWords } from '@bldr/dom-manipulator'

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`

export default validateMasterSpec({
  name: 'editor',
  title: 'Hefteintrag',
  propsDef: {
    markup: {
      type: String,
      markup: true,
      description:
        'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
    },
    ...mapStepFieldDefintionsToProps(['mode', 'subset'])
  },
  icon: {
    name: 'pencil',
    color: 'blue'
  },
  styleConfig: {
    centerVertically: false,
    contentTheme: 'handwriting'
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'boolean') {
        props = {
          markup: '<div>…</div>'
        }
      } else if (typeof props === 'string') {
        props = {
          markup: props
        }
      }

      props.markup = convertMarkdownToHtml(props.markup)
      props.markup = props.markup.replace(
        />…</g,
        ` contenteditable>${placeholderTag}<`
      )

      if (props.stepMode && props.stepMode === 'words') {
        props.markup = wrapWords(props.markup)
      }
      return props
    },
    calculateStepCount ({ props }) {
      return buildTextStepController(this.$el, props).stepCount
    },
    plainTextFromProps (props) {
      return convertHtmlToPlainText(props.markup)
    },
    leaveSlide ({ oldProps }) {
      const element = document.querySelector('.vc_editor_master')
      if (element) {
        oldProps.markup = element.innerHTML
      }
    }
  }
})
