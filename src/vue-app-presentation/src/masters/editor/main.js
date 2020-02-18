import { plainText } from '@bldr/core-browser'
import { markupToHtml, wrapWords, DomSteps } from '@/lib.js'

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`

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
      props.markup = wrapWords(props.markup)
    }
    return props
  },
  plainTextFromProps (props) {
    return plainText(props.markup)
  },
  enterSlide () {
    this.onSlideChange()
    let specializedSelector
    let sentencesSelector
    if (this.stepWords) {
      specializedSelector = 'words'
    } else if (this.stepSentences) {
      specializedSelector = 'sentences'
      sentencesSelector = '.vc_editor_master'
    }

    if (specializedSelector) {
      this.domSteps = new DomSteps({
        subsetSelectors: this.stepSubset,
        specializedSelector,
        sentencesSelector,
        hideAllElementsInitally: false
      })
      this.slideCurrent.renderData.stepCount = this.domSteps.count
      this.domSteps.displayByNo({ stepNo: this.slideCurrent.renderData.stepNoCurrent, full: true })
    }
  },
  beforeLeaveSlide ({ oldProps }) {
    const element = document.querySelector('.vc_editor_master')
    if (element) oldProps.markup = element.innerHTML
  },
  enterStep ({ oldStepNo, newStepNo }) {
    const stepNo = newStepNo
    if (this.stepWords || this.stepSentences) {
      this.domSteps.displayByNo({
        oldStepNo,
        stepNo
      })
    }
  }
}
