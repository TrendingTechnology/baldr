import { stepSupport } from '@/lib.js'

export default {
  title: 'Lückentext',
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
      mediaFileUri: true
    },
    ...stepSupport.props
  },
  icon: {
    name: 'cloze',
    color: 'blue'
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
  enterStep ({ oldStepNo, newStepNo }) {
    const newClozeGroup = this.domSteps.displayByNo({
      oldStepNo,
      stepNo: newStepNo
    })
    this.scroll(newClozeGroup)
  },
  collectPropsMain (props) {
    const svgMediaFile = this.$store.getters['media/mediaFileByUri'](props.src)
    return {
      svgPath: svgMediaFile.path,
      svgHttpUrl: svgMediaFile.httpUrl,
      stepBegin: props.stepBegin,
      stepEnd: props.stepEnd
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      svgHttpUrl: propsMain.svgHttpUrl
    }
  }
}
