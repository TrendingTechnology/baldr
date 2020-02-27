import { plainText } from '@bldr/core-browser'
import { markupToHtml, DomSteps } from '@/lib.js'

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
  if (!charactersOnSlide) charactersOnSlide = CHARACTERS_ON_SLIDE
  if (htmlString.length < charactersOnSlide) return [htmlString]

  const domParser = new DOMParser()
  let dom = domParser.parseFromString(htmlString, 'text/html')

  // If htmlString is a text without tags
  if (!dom.body.children.length) {
    dom = domParser.parseFromString(`<p>${htmlString}</p>`, 'text/html')
  }

  let buffer = ''
  const chunks = []

  // childNodes not children!
  for (const children of dom.body.childNodes) {
    // If htmlString is a text with inner tags
    if (children.nodeName === '#text') {
      buffer += children.textContent
    } else {
      buffer += children.outerHTML
    }
    if (buffer.length > charactersOnSlide) {
      chunks.push(buffer)
      buffer = ''
    }
  }
  // Add last not full buffer
  if (buffer) chunks.push(buffer)
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
      description: 'Markup im HTML oder Markdown-Format'
    },
    charactersOnSlide: {
      type: [Number],
      description: 'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
      default: CHARACTERS_ON_SLIDE
    },
    ...DomSteps.mapProps(['words', 'sentences', 'subset'])
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

    if (props.stepWords) {
      props.markup = [DomSteps.wrapWords(markup.join(' '))]
    } else {
      props.markup = markup
    }
    return props
  },
  calculateStepCount (props) {
    return props.markup.length
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
    if (this.stepSentences) {
      sentencesSelector = '.vc_generic_master'
    }

    let specializedSelector = DomSteps.getSpecializedSelectorsFromProps(this)

    if (specializedSelector) {
      this.domSteps = new DomSteps({
        subsetSelectors: this.stepSubset,
        specializedSelector,
        sentencesSelector,
        hideAllElementsInitally: false
      })
      this.domSteps.setStepCount(this.slideCurrent)
      this.domSteps.displayByNo({ stepNo: this.slideCurrent.renderData.stepNoCurrent, full: true })
    }
  },
  enterStep ({ oldStepNo, newStepNo }) {
    const stepNo = newStepNo
    if (this.stepWords || this.stepSentences) {
      this.domSteps.displayByNo({
        oldStepNo,
        stepNo
      })
    }
  },
  collectPropsPreview ({ props }) {
    return {
      markup: props.markup[0]
    }
  }
}
