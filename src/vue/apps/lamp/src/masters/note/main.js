/**
 * @module @bldr/lamp/masters/note
 */

import { validateMasterSpec } from '@bldr/lamp-core'
import { convertHtmlToPlainText } from '@bldr/core-browser'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'

import { buildTextStepController, wrapWords } from '@bldr/dom-manipulator'

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
    },
    afterSlideNoChangeOnComponent () {
      this.stepController = buildTextStepController(this.$el, {
        stepMode: 'words'
      })
    },
    afterStepNoChangeOnComponent ({ newStepNo }) {
      const step = this.stepController.showUpTo(newStepNo)
      if (step != null) {
        scroll(step.htmlElement)
      }
    }
  }
})
