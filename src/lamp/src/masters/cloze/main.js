/**
 * @module @bldr/lamp/masters/cloze
 */

import { DomSteps } from '@/steps.js'

export default {
  title: 'Lückentext',
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
      mediaFileUri: true
    },
    ...DomSteps.mapProps(['subset'])
  },
  icon: {
    name: 'cloze',
    color: 'blue'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = { src: props }
      }
      return props
    },
    resolveMediaUris (props) {
      return props.src
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
    },
    enterStep ({ oldStepNo, newStepNo }) {
      // setSlideOrStepPrevious / Next has no this.domSteps
      if (!this.domSteps) return
      const newClozeGroup = this.domSteps.displayByNo({
        oldStepNo,
        stepNo: newStepNo
      })
      this.scroll(newClozeGroup)
    }
  }
}
