/**
 * @module @bldr/lamp/masters/note
 */

import { validateMasterSpec } from '@bldr/lamp-core'
import { convertHtmlToPlainText } from '@bldr/core-browser'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'

import steps from '@/steps'

function scroll (element) {
  if (!element) return
  const y = element.getBoundingClientRect().top + window.scrollY
  const adjustedY = y - 0.8 * window.screen.height
  window.scrollTo({ top: adjustedY, left: 0, behavior: 'smooth' })
}

export default validateMasterSpec({
  name: 'note',
  title: 'Hefteintrag',
  propsDef: {
    markup: {
      type: String,
      markup: true,
      description: 'Text im HTML- oder Markdown-Format oder als reiner Text.'
    },
    items: {
      type: Array
    },
    sections: {
      type: Array
    }
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
      if (typeof props === 'string') {
        props = {
          markup: props
        }
      }

      let markupItems = ''
      let markupSections = ''

      if (!props) props = {}

      if (!props.markup) {
        props.markup = ''
      }

      if (props.sections) {
        const h = []
        let level = 2
        for (const section of props.sections) {
          h.push(`<h${level}>${section}</h${level}>`)
          level++
        }
        markupSections = h.join('')
      }

      if (props.items) {
        const li = []
        for (const item of props.items) {
          li.push(`<li>${item}</li>`)
        }
        markupItems = `<ul>${li.join('')}</ul>`
      }

      let hr = ''
      if (markupSections && markupItems) {
        hr = '<hr>'
      }
      props.markup = markupSections + hr + markupItems + props.markup

      props.markup = convertMarkdownToHtml(props.markup)

      // hr tag
      if (props.markup.indexOf('<hr>') > -1) {
        const segments = props.markup.split('<hr>')
        const prolog = segments.shift()
        let body = segments.join('<hr>')
        body = '<span class="word-area">' + steps.wrapWords(body) + '</span>'
        props.markup = [prolog, body].join('')
      // No hr tag provided
      // Step through all words
      } else {
        props.markup = steps.wrapWords(props.markup)
      }
      return props
    },
    calculateStepCount ({ props }) {
      return steps.generateSlideStepsFromText(props.markup, { stepMode: 'words' })
    },
    plainTextFromProps (props) {
      return convertHtmlToPlainText(props.markup)
    },
    afterSlideNoChangeOnComponent () {
      this.domSteps = new steps.DomSteps({
        mode: 'words',
        rootElement: this.$el,
        hideAllElementsInitally: true
      })
    },
    afterStepNoChangeOnComponent ({ newStepNo, oldStepNo, slideNoChange }) {
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
