/**
 * @module @bldr/lamp/masters/cloze
 */

import steps from '@/steps.js'
import Vue from 'vue'

/**
 *
 * @param {Object} dom - The global `document` object or a object
 * created by `DOMParser()`.
 */
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

/**
 * @param {Object} clozeGroup
 */
export function scrollToClozeGroup (clozeGroup) {
  if (!clozeGroup) return
  // e. g.: 1892
  // svg.clientHeight
  const svg = document.querySelector('svg')
  // e. g.: 794.4473876953125
  // bBox.height
  const bBox = svg.getBBox()
  const glyph = clozeGroup.children[0]
  // e. g.: 125.11000061035156
  const y = svg.clientHeight / bBox.height * glyph.y.baseVal.value
  const adjustedY = y - 0.8 * window.screen.height
  window.scrollTo({ top: adjustedY, left: 0, behavior: 'smooth' })
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
    ...steps.mapProps(['subset'])
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
      const count = steps.calculateStepCount(groups, props)
      return count
    },
    enterStep ({ oldStepNo, newStepNo }) {
      // setSlideOrStepPrevious / Next has no this.domSteps
      if (!this.domSteps) return
      const newClozeGroup = this.domSteps.displayByNo({
        oldStepNo,
        stepNo: newStepNo
      })
      scrollToClozeGroup(newClozeGroup)
    }
  }
}
