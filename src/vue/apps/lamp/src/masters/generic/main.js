/**
 * @module @bldr/lamp/masters/generic
 */

import { splitHtmlIntoChunks } from '@bldr/core-browser'
import { convertHtmlToPlainText } from '@bldr/string-format'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { validateMasterSpec } from '@bldr/lamp-core'
import { mapStepFieldDefintions } from '@bldr/presentation-parser'
import { buildTextStepController, wrapWords } from '@bldr/dom-manipulator'

const CHARACTERS_ON_SLIDE = 400

// function adjustSlideSize (rootElement, wrapperElement) {
//   let size = 1

//   const rootWidth = rootElement.clientWidth
//   const rootHeight = rootElement.clientHeight

//   let wrapperRect, wrapperWidth, wrapperHeight

//   do {
//     wrapperRect = wrapperElement.getBoundingClientRect()
//     wrapperWidth = wrapperRect.width
//     wrapperHeight = wrapperRect.height
//     rootElement.style.fontSize = `${size}em`
//     size += 0.2
//   } while (rootWidth > wrapperWidth * 1.5 && rootHeight > wrapperHeight * 1.5)
//   rootElement.style.fontSize = `${size - 0.2}em`
// }

export default validateMasterSpec({
  name: 'generic',
  title: 'Folie',
  propsDef: {
    markup: {
      type: [String, Array],
      required: true,
      // It is complicated to convert to prop based markup conversion.
      // markup: true
      inlineMarkup: true,
      description: 'Markup im HTML oder Markdown-Format'
    },
    charactersOnSlide: {
      type: Number,
      description:
        'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
      default: CHARACTERS_ON_SLIDE
    },
    onOne: {
      description:
        'Der ganze Text erscheint auf einer Folien. Keine automatischen Folienumbrüche.',
      type: Boolean,
      default: false
    },
    ...mapStepFieldDefintions(['mode', 'subset'])
  },
  icon: {
    name: 'file-presentation-box',
    color: 'gray',
    showOnSlides: false
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string' || Array.isArray(props)) {
        props = {
          markup: props
        }
      }
      if (typeof props.markup === 'string') {
        props.markup = [props.markup]
      }

      // Convert into HTML
      const converted = []
      for (const markup of props.markup) {
        converted.push(convertMarkdownToHtml(markup))
      }

      // Split by <hr>
      const splittedByHr = []
      for (const html of converted) {
        if (html.indexOf('<hr>') > -1) {
          const chunks = html.split('<hr>')
          for (const chunk of chunks) {
            splittedByHr.push(chunk)
          }
        } else {
          splittedByHr.push(html)
        }
      }

      // Split large texts into smaller chunks
      let markup = []
      for (const html of splittedByHr) {
        const chunks = splitHtmlIntoChunks(html, props.charactersOnSlide)
        for (const chunk of chunks) {
          markup.push(chunk)
        }
      }

      if (props.onOne) {
        markup = [markup.join(' ')]
      }

      if (props.stepMode && props.stepMode === 'words') {
        props.markup = [wrapWords(markup.join(' '))]
      } else {
        props.markup = markup
      }
      return props
    },
    collectPropsPreview ({ props }) {
      return {
        markup: props.markup[0]
      }
    },
    calculateStepCount ({ props }) {
      if (props.stepMode) {
        let markup
        if (Array.isArray(props.markup)) {
          markup = props.markup.join('')
        } else {
          markup = props.markup
        }
        return buildTextStepController(markup, props).stepCount
      } else {
        return props.markup.length
      }
    },
    plainTextFromProps (props) {
      const output = []
      for (const markup of props.markup) {
        output.push(convertHtmlToPlainText(markup))
      }
      return output.join(' | ')
    },
    afterSlideNoChangeOnComponent ({ newSlideNo }) {
      const slide = this.$get('slide')
      // adjustSlideSize(this.$el, this.$refs.contentWrapper)
      if (this.stepMode) {
        this.stepController = buildTextStepController(this.$el, slide.props)
      }
    },
    afterStepNoChangeOnComponent ({ newStepNo }) {
      if (this.stepController == null || this.stepMode == null) {
        return
      }
      const step = this.stepController.showUpTo(newStepNo)
      if (step != null) {
        scroll(step.htmlElement)
      }
    }
  }
})
