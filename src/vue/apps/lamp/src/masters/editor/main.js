/**
 * @module @bldr/lamp/masters/editor
 */

import { convertHtmlToPlainText } from '@bldr/core-browser'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { validateMasterSpec } from '@bldr/lamp-core'
import { mapStepFieldDefintions } from '@bldr/presentation-parser'

import * as steps from '@/steps'

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`

function scroll (element) {
  if (!element) return
  const y = element.getBoundingClientRect().top + window.scrollY
  const adjustedY = y - 0.8 * window.screen.height
  window.scrollTo({ top: adjustedY, left: 0, behavior: 'smooth' })
}

export default validateMasterSpec({
  name: 'editor',
  title: 'Hefteintrag',
  propsDef: {
    markup: {
      type: String,
      markup: true,
      description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
    },
    ...mapStepFieldDefintions(['mode', 'subset'])
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
        props.markup = steps.wrapWords(props.markup)
      }
      return props
    },
    calculateStepCount ({ props }) {
      return steps.calculateStepCountText(props.markup, props, -1)
    },
    plainTextFromProps (props) {
      return convertHtmlToPlainText(props.markup)
    },
    leaveSlide ({ oldProps }) {
      const element = document.querySelector('.vc_editor_master')
      if (element) oldProps.markup = element.innerHTML
    },
    afterSlideNoChangeOnComponent ({ newSlideNo }) {
      this.onSlideChange()
      if (this.stepMode) {
        this.domSteps = new steps.DomStepController({
          subsetSelector: this.stepSubset,
          mode: this.stepMode,
          rootElement: this.$el,
          hideAllElementsInitally: false
        })
      }
    },
    afterStepNoChangeOnComponent ({ newStepNo, oldStepNo, slideNoChange }) {
      if (!this.domSteps || !this.stepMode) return
      const options = { stepNo: newStepNo }
      if (slideNoChange) {
        options.full = true
      } else {
        options.oldStepNo = oldStepNo
      }
      const element = this.domSteps.displayByNo(options)
      scroll(element)
    }
  }
})
