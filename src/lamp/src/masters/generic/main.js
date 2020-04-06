/**
 * @module @bldr/lamp/masters/generic
 */

import { plainText } from '@bldr/core-browser'
import { markupToHtml } from '@/lib.js'
import steps from '@/steps.js'

const CHARACTERS_ON_SLIDE = 400

/* globals DOMParser */

/**
 * Split a HTML text into smaller chunks by looping over the children.
 *
 * @param {String} htmlString
 * @param {Number} charactersOnSlide
 *
 * @returns {Array}
 */
function splitHtmlintoChunks (htmlString, charactersOnSlide) {
  /**
   * Add text to the chunks array. Add only text with real letters not with
   * whitespaces.
   *
   * @param {Array} chunks
   * @param {String} text
   */
  function addText (chunks, text) {
    if (text && !text.match(/^\s*$/)) {
      chunks.push(text)
    }
  }

  if (!charactersOnSlide) charactersOnSlide = CHARACTERS_ON_SLIDE
  if (htmlString.length < charactersOnSlide) return [htmlString]

  const domParser = new DOMParser()
  let dom = domParser.parseFromString(htmlString, 'text/html')

  // If htmlString is a text without tags
  if (!dom.body.children.length) {
    dom = domParser.parseFromString(`<p>${htmlString}</p>`, 'text/html')
  }

  let text = ''
  const chunks = []

  // childNodes not children!
  for (const children of dom.body.childNodes) {
    // If htmlString is a text with inner tags
    if (children.nodeName === '#text') {
      text += children.textContent
    } else {
      text += children.outerHTML
    }
    if (text.length > charactersOnSlide) {
      addText(chunks, text)
      text = ''
    }
  }
  // Add last not full text
  addText(chunks, text)
  return chunks
}

export default {
  title: 'Folie',
  props: {
    markup: {
      type: [String, Array],
      required: true,
      // It is complicated to convert to prop based markup conversion.
      // markup: true
      inlineMarkup: true,
      description: 'Markup im HTML oder Markdown-Format'
    },
    charactersOnSlide: {
      type: [Number],
      description: 'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
      default: CHARACTERS_ON_SLIDE
    },
    ...steps.mapProps(['mode', 'subset'])
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
        converted.push(markupToHtml(markup))
      }

      // Split by <hr>
      const steps = []
      for (const html of converted) {
        if (html.indexOf('<hr>') > -1) {
          const chunks = html.split('<hr>')
          for (const chunk of chunks) {
            steps.push(chunk)
          }
        } else {
          steps.push(html)
        }
      }

      // Split large texts into smaller chunks
      const markup = []
      for (const html of steps) {
        const chunks = splitHtmlintoChunks(html, props.charactersOnSlide)
        for (const chunk of chunks) {
          markup.push(chunk)
        }
      }

      if (props.stepMode && props.stepMode === 'words') {
        props.markup = [steps.wrapWords(markup.join(' '))]
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
        return steps.calculateStepCountText(props.markup, props)
      } else {
        return props.markup.length
      }
    },
    plainTextFromProps (props) {
      const output = []
      for (const markup of props.markup) {
        output.push(plainText(markup))
      }
      return output.join(' | ')
    },
    enterSlide () {
      let sentencesSelector
      if (this.stepMode === 'sentences') {
        sentencesSelector = '.vc_generic_master'
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
        this.domSteps.displayByNo({
          oldStepNo,
          stepNo
        })
      }
    }
  }
}
