import { plainText } from '@bldr/core-browser'
import { markupToHtml, DomSteps } from '@/lib.js'

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
    overflow: false,
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

      props.markup = markupToHtml(props.markup)

      // hr tag
      if (props.markup.indexOf('<hr>') > -1) {
        const segments = props.markup.split('<hr>')
        const prolog = segments.shift()
        let body = segments.join('<hr>')
        body = DomSteps.wrapWords(body)
        props.markup = [prolog, body].join('')
      // No hr tag provided
      // Step through all words
      } else {
        props.markup = DomSteps.wrapWords(props.markup)
      }
      return props
    },
    plainTextFromProps (props) {
      return plainText(props.markup)
    },
    enterSlide () {
      this.domSteps = new DomSteps({
        specializedSelector: 'words',
        hideAllElementsInitally: false
      })
      this.domSteps.setStepCount(this.slideCurrent)
      this.domSteps.displayByNo({ stepNo: this.slideCurrent.renderData.stepNoCurrent, full: true })
    },
    enterStep ({ oldStepNo, newStepNo }) {
      // If you come from a different master, domSteps is not set up yet.
      if (this.domSteps) {
        const stepNo = newStepNo
        const element = this.domSteps.displayByNo({
          oldStepNo,
          stepNo
        })
        scroll(element)
      }
    }
  }
}