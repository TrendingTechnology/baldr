import { plainText } from '@bldr/core-browser'
import { markupToHtml, DomSteps } from '@/lib.js'

function scroll(element) {
  if (!element) return
  const y = element.getBoundingClientRect().top + window.scrollY
  const adjustedY = y - 0.8 * window.screen.height
  window.scrollTo({ top: adjustedY, left: 0, behavior: 'smooth' });
}

export default {
  title: 'Hefteintrag',
  props: {
    markup: {
      type: String,
      markup: true,
      description: 'Text im HTML- oder Markdown-Format oder als reiner Text.'
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
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = {
        markup: props
      }
    }

    let markup = markupToHtml(props.markup)

    // hr tag
    if (markup.indexOf('<hr>') > -1) {
      const segments = markup.split('<hr>')
      const prolog = segments.shift()
      let body = segments.join('<hr>')
      body = DomSteps.wrapWords(body)
      markup = [prolog, body].join('')
    // No hr tag provided
    // Step through all words
    } else {
      markup = DomSteps.wrapWords(markup)
    }

    props.markup = markup
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
    const stepNo = newStepNo
    const element = this.domSteps.displayByNo({
      oldStepNo,
      stepNo
    })
    scroll(element)
  }
}
