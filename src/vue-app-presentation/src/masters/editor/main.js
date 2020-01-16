import { plainText } from '@bldr/core-browser'
import { markupToHtml, wrapWords, stepSupport } from '@/lib.js'

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`
const example = `
---
slides:

- title: Step words
  editor:
    step_words: true
    markup: |
      # heading

      * one
      * two
      * three

      lorem ipsum

- editor

- title: Unordered list
  editor: |
    # heading

    - …

- title: Unordered list as HTML
  editor: |
    <ul contenteditable>
      <li>.</li>
    </ul>

- title: Unordered list as HTML with …
  editor: |
    <ul contenteditable>
      <li>…</li>
    </ul>

- title: Show editor
  editor: |
    # heading

    …

- title: Multple ellipsis
  editor: |

    …

    …

- title: Show editor
  editor: true

- title: Show second editor
  editor: true

- title: Markup
  editor:
    markup: |
      <strong>Specifed with prop markup</strong>:

      …

- title: Markup as string
  editor: |
    <strong>Markup as string</strong>:

    …

- title: 'HTML: <ul>'
  editor: |
    <ul>
      <li>…</li>
    </ul>

- title: 'HTML: <table>'
  editor: |
    <table>
      <thead>
        <tr>
          <td>Musikalische Merkmale</td>
          <td>Interpretation</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>…</td>
          <td>…</td>
        </tr>
      </tbody>
    </table>

- title: 'HTML: <table> replace … with contenteditable'
  editor: |
    <table>
      <thead>
        <tr>
          <th></th>
          <td>Thema 1 (Spanier)</td>
          <td>Thema 2 (Niederländer)</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Dynamik</th>
          <td>…</td>
          <td>…</td>
        </tr>
        <tr>
          <th>Rhythmik</th>
          <td>…</td>
          <td>…</td>
        </tr>
        <tr>
          <th>Satztechnik</th>
          <td>…</td>
          <td>…</td>
        </tr>
        <tr>
          <th>Artikulation</th>
          <td>…</td>
          <td>…</td>
        </tr>
        <tr>
          <th>Tonlage</th>
          <td>…</td>
          <td>…</td>
        </tr>
      </tbody>
    </table>

- title: 'Markdown'
  editor: |
    # heading 1

    lorem **ipsum** lorem

    …
`

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
  example,
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
      steps = document.querySelectorAll('span.word')
    } else if (this.stepSentences) {
      steps = stepSupport.selectSentences('.vc_editor_master')
    }
    console.log(this.stepSentences)

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
    if (this.stepWords) stepSupport.displayElementByNo({
      elements: this.steps,
      oldStepNo,
      stepNo,
      visibility: true
    })
  }
}
