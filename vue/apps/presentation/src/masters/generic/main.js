/**
 * @module @bldr/presentation/masters/generic
 */

import { convertHtmlToPlainText } from '@bldr/string-format'
import { validateMasterSpec } from '../../lib/masters'
import { mapStepFieldDefintionsToProps, genericMModul } from '@bldr/presentation-parser'
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
  name: 'master-generic',
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
    ...mapStepFieldDefintionsToProps(['mode', 'subset'])
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

      const charactersOnSlide =
        props.charactersOnSlide != null
          ? props.charactersOnSlide
          : CHARACTERS_ON_SLIDE
      props.markup = genericMModul.splitMarkup(props.markup, charactersOnSlide)

      if (props.onOne) {
        props.markup = [props.markup.join(' ')]
      }

      if (props.stepMode != null && props.stepMode === 'words') {
        props.markup = [wrapWords(props.markup.join(' '))]
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
    }
  }
})
