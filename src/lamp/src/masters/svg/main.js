/**
 * @module @bldr/lamp/masters/svg
 */

import { warnSvgWidthHeight } from '@/lib.js'
import steps from '@/steps.js'
import Vue from 'vue'

export default {
  title: 'Interaktive Grafik',
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei.',
      mediaFileUri: true
    },
    ...steps.mapProps(['selector', 'subset'])
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
      if (!props.stepSelector) {
        const propDefs = steps.mapProps(['selector'])
        props.stepSelector = propDefs.stepSelector.default
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
    },
    calculateStepCount ({ props, master }) {
      const svgString = master.$get('svgByUri')(props.src)
      const svgDom = new DOMParser().parseFromString(svgString, 'image/svg+xml')
      const groups = svgDom.querySelectorAll(props.stepSelector)
      console.log(groups)
      const count = steps.calculateStepCount(groups, props)
      return count
    },
    leaveSlide () {
      this.domSteps.shortcutsUnregister()
    },
    async enterSlide () {
      warnSvgWidthHeight(this.svgPath)
      this.domSteps = new steps.DomSteps({
        cssSelectors: this.stepSelector,
        subsetSelectors: this.slide.props.stepSubset,
        hideAllElementsInitally: false
      })

      this.domSteps.displayByNo({
        stepNo: this.slide.stepNo
      })

      this.domSteps.shortcutsRegister()
    },
    enterStep ({ oldStepNo, newStepNo }) {
      // setSlideOrStepPrevious / Next has no this.domSteps
      if (!this.domSteps) return
      this.domSteps.displayByNo({
        oldStepNo,
        stepNo: newStepNo
      })
    }
  }
}
