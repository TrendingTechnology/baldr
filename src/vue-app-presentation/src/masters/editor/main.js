import { plainText } from '@bldr/core-browser'
import { markupToHtml, wrapWords, stepSupport } from '@/lib.js'

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
    ...stepSupport.props
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
    let steps
    if (this.stepWords) {
      steps = stepSupport.selectWords()
    } else if (this.stepSentences) {
      steps = stepSupport.selectSentences('.vc_editor_master')
    }
    if (steps) {
      this.steps = stepSupport.limitElements(
        steps,
        {
          stepBegin: this.stepBegin,
          stepEnd: this.stepEnd
        }
     )
     this.slideCurrent.renderData.stepCount = this.steps.length + 1
     stepSupport.displayElementByNo({
       elements: this.steps,
       stepNo: this.slideCurrent.renderData.stepNoCurrent,
       full: true,
       visibility: true
     })
    }
  },
  beforeLeaveSlide ({ oldProps }) {
    const element = document.querySelector('.vc_editor_master')
    if (element) oldProps.markup = element.innerHTML
  },
  enterStep ({ oldStepNo, newStepNo }) {
    const stepNo = newStepNo
    if (this.stepWords || this.stepSentences) stepSupport.displayElementByNo({
      elements: this.steps,
      oldStepNo,
      stepNo,
      visibility: true
    })
  }
}
