import { warnSvgWidthHeight, DomSteps } from '@/lib.js'

export default {
  title: 'Bild',
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei.',
      mediaFileUri: true
    },
    ...DomSteps.mapProps(['selector', 'subset'])
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
    return props.src
  },
  async enterSlide () {
    const response = await this.$media.httpRequest.request({
      url: `/media/${this.svgPath}`,
      method: 'get'
    })
    const svg = this.$refs.svgWrapper
    svg.innerHTML = response.data
    warnSvgWidthHeight(this.svgPath)

    this.domSteps = new DomSteps({
      cssSelectors: this.stepSelector,
      subsetSelectors: this.slideCurrent.renderData.props.stepSubset,
      hideAllElementsInitally: false
    })

    this.domSteps.displayByNo({
      stepNo: this.slideCurrent.renderData.stepNoCurrent
    })

    this.domSteps.setStepCount(this.slideCurrent)
    this.domSteps.shortcutsRegister()
  },
  leaveSlide () {
    this.domSteps.shortcutsUnregister()
  },
  enterStep ({ oldStepNo, newStepNo }) {
    this.domSteps.displayByNo({
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
      stepSubset: props.stepSubset
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      svgHttpUrl: propsMain.svgHttpUrl
    }
  }
}
