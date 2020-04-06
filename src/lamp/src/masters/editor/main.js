/**
 * @module @bldr/lamp/masters/editor
 */

import { plainText } from '@bldr/core-browser'
import { markupToHtml } from '@/lib.js'
import steps from '@/steps.js'

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`

function scroll (element) {
  if (!element) return
  const y = element.getBoundingClientRect().top + window.scrollY
  const adjustedY = y - 0.8 * window.screen.height
  window.scrollTo({ top: adjustedY, left: 0, behavior: 'smooth' })
}

export default {
  title: 'Hefteintrag',
  props: {
    markup: {
      type: String,
      markup: true,
      description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
    },
    ...steps.mapProps(['mode', 'subset'])
  },
  icon: {
    name: 'pencil',
    color: 'blue'
  },
  styleConfig: {
    centerVertically: false,
    overflow: false,
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

      props.markup = markupToHtml(props.markup)
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
      return steps.calculateStepCountText(props.markup, props)
    },
    plainTextFromProps (props) {
      return plainText(props.markup)
    },
    beforeLeaveSlide ({ oldProps }) {
      const element = document.querySelector('.vc_editor_master')
      if (element) oldProps.markup = element.innerHTML
    },
    enterSlide () {
      this.onSlideChange()
      let sentencesSelector
      if (this.stepMode === 'sentences') {
        sentencesSelector = '.vc_editor_master'
      }

      if (this.stepMode) {
        this.domSteps = new steps.DomSteps({
          subsetSelectors: this.stepSubset,
          mode: this.stepMode,
          sentencesSelector,
          hideAllElementsInitally: false
        })
        this.domSteps.setStepCount(this.slide)
        this.domSteps.displayByNo({ stepNo: this.slide.stepNo, full: true })
      }
    },
    enterStep ({ oldStepNo, newStepNo }) {
      const stepNo = newStepNo
      if (this.stepMode) {
        const element = this.domSteps.displayByNo({
          oldStepNo,
          stepNo
        })
        scroll(element)
      }
    }
  }
}
