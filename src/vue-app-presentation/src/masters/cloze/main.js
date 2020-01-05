import {displayElementByStepNo } from '@/lib.js'

const example = `
---
slides:

- title: Begin end
  cloze:
    src: id:AB_Bachs-vergebliche-Reise
    step_begin: 3
    step_end: 5

- title: end
  cloze:
    src: id:AB_Bachs-vergebliche-Reise
    step_end: 20

- title: Begin
  cloze:
    src: id:AB_Bachs-vergebliche-Reise
    step_begin: 21

- title: Short form
  cloze: id:AB_Bachs-vergebliche-Reise

- title: Long form
  cloze:
    src: id:Bebop_AB

- title: Table 1
  cloze:
    src: New-Orleans-Dixieland_AB1

- title: Table 2
  cloze:
    src: New-Orleans-Dixieland_AB2
`

export default {
  title: 'Lückentext',
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
      mediaFileUri: true
    },
    stepBegin: {
      type: Number,
      description: 'Beginne bei dieser Schrittnumber Lückentextwörter einzublenden.'
    },
    stepEnd: {
      type: Number,
      description: 'Höre bei dieser Schrittnumber auf Lückentextwörter einzublenden.'
    }
  },
  icon: {
    name: 'cloze',
    color: 'blue'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
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
    const newClozeGroup = displayElementByStepNo({
      elements: this.clozeGroups,
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
