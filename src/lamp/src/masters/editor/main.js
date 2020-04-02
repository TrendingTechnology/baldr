import { plainText } from '@bldr/core-browser'
import { markupToHtml, DomSteps } from '@/lib.js'

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
    ...DomSteps.mapProps(['words', 'sentences', 'subset'])
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

      if (props.stepWords) {
        props.markup = DomSteps.wrapWords(props.markup)
      }
      return props
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
      if (this.stepSentences) {
        sentencesSelector = '.vc_editor_master'
      }

      const specializedSelector = DomSteps.getSpecializedSelectorsFromProps(this)

      if (specializedSelector) {
        this.domSteps = new DomSteps({
          subsetSelectors: this.stepSubset,
          specializedSelector,
          sentencesSelector,
          hideAllElementsInitally: false
        })
        this.domSteps.setStepCount(this.slideCurrent)
        this.domSteps.displayByNo({ stepNo: this.slideCurrent.stepNoCurrent, full: true })
      }
    },
    enterStep ({ oldStepNo, newStepNo }) {
      const stepNo = newStepNo
      if (this.stepWords || this.stepSentences) {
        const element = this.domSteps.displayByNo({
          oldStepNo,
          stepNo
        })
        scroll(element)
      }
    }
  }
}
