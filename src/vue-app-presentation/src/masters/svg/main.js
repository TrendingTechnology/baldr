import { stepSupport, warnSvgWidthHeight } from '@/lib.js'

const stepExclude = stepSupport.props.stepExclude

export default {
  title: 'Bild',
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei.',
      mediaFileUri: true
    },
    stepSelector: {
      description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen.'
    },
    stepExclude
  },
  icon: {
    name: 'image',
    color: 'blue',
    showOnSlides: false
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { src: props }
    }
    return props
  },
  resolveMediaUris (props) {
    return [props.src]
  },
  async enterSlide () {
    const response = await this.$media.httpRequest.request({
      url: `/media/${this.svgPath}`,
      method: 'get'
    })
    const svg = this.$refs.svgWrapper
    svg.innerHTML = response.data
    warnSvgWidthHeight(this.svgPath)
    this.elGroups = svg.querySelectorAll(this.stepSelector)
    this.elGroups = stepSupport.excludeElements(this.elGroups, this.stepExclude)
    this.slideCurrent.renderData.stepCount = this.elGroups.length + 1
    stepSupport.displayElementByNo({
      elements: this.elGroups,
      stepNo: this.slideCurrent.renderData.stepNoCurrent
    })
    stepSupport.shortcutsRegister(this.elGroups)
  },
  leaveSlide () {
    stepSupport.shortcutsUnregister(this.elGroups)
  },
  enterStep ({ oldStepNo, newStepNo }) {
    stepSupport.displayElementByNo({
      elements: this.elGroups,
      oldStepNo,
      stepNo: newStepNo
    })
  },
  collectPropsMain (props) {
    const svgMediaFile = this.$store.getters['media/mediaFileByUri'](props.src)
    return {
      svgPath: svgMediaFile.path,
      svgTitle: svgMediaFile.title,
      svgHttpUrl: svgMediaFile.httpUrl,
      stepSelector: props.stepSelector,
      stepExclude: props.stepExclude
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      svgHttpUrl: propsMain.svgHttpUrl
    }
  }
}
