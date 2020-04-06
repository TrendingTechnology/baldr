/**
 * @module @bldr/lamp/masters/cloze
 */

import { DomSteps } from '@/steps.js'
import Vue from 'vue'
import { selectSubset } from '@bldr/core-browser'

export function collectClozeGroups (dom) {
  const groups = dom.querySelectorAll('svg g')
  const clozeGElements = []
  for (const group of groups) {
    if (group.style.fill === 'rgb(0, 0, 255)') {
      clozeGElements.push(group)
    }
  }
  return clozeGElements
}

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
  store: {
    state: {},
    getters: {
      svgByUri: state => uri => {
        if (state[uri]) return state[uri]
      }
    },
    mutations: {
      addSvg (state, { uri, markup }) {
        Vue.set(state, uri, markup)
      }
    }
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
    async afterMediaResolution ({ props, master }) {
      const svg = master.$get('svgByUri')(props.src)
      if (!svg) {
        const mediaAsset = this.$store.getters['media/mediaFileByUri'](props.src)
        const response = await this.$media.httpRequest.request({
          url: `/media/${mediaAsset.path}`,
          method: 'get'
        })
        if (response.data) master.$commit('addSvg', { uri: props.src, markup: response.data })
      }
    },
    collectPropsMain (props) {
      const svgMediaFile = this.$store.getters['media/mediaFileByUri'](props.src)
      return {
        src: props.src,
        svgPath: svgMediaFile.path,
        svgHttpUrl: svgMediaFile.httpUrl
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        svgHttpUrl: propsMain.svgHttpUrl
      }
    },
    calculateStepCount ({ props, master }) {
      const svgString = master.$get('svgByUri')(props.src)
      const svgDom = new DOMParser().parseFromString(svgString, 'image/svg+xml')
      const groups = collectClozeGroups(svgDom)

      const count = groups.length
      if (props.stepSubset) {
        const elements = selectSubset(props.stepSubset, {
          elementsCount: count,
          shiftSelector: -1
        })
        return elements.length + 1
      } else {
        return count + 1
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
