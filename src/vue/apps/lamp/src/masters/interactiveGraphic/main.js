/**
 * @module @bldr/lamp/masters/interactiveGraphic
 */

/* globals DOMParser */
import Vue from 'vue'

import { warnSvgWidthHeight } from '@/lib.js'
import { buildSvgStepController } from '@bldr/dom-manipulator'
import { validateMasterSpec } from '@bldr/lamp-core'
import { mapStepFieldDefintions } from '@bldr/presentation-parser'

export default validateMasterSpec({
  name: 'interactiveGraphic',
  title: 'Interaktive Grafik',
  propsDef: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei.',
      assetUri: true
    },
    mode: {
      description:
        'layer (Inkscape-Ebenen), layer+ (Elemente der Inkscape-Ebenen), group (Gruppierungen)',
      default: 'layer',
      validate: input => {
        return ['layer', 'layer+', 'group'].includes(input)
      }
    },
    ...mapStepFieldDefintions(['selector', 'subset'])
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
        const propDefs = mapStepFieldDefintions(['selector'])
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
        const mediaAsset = this.$store.getters['media/assetByUri'](props.src)
        const response = await this.$media.httpRequest.request({
          url: `/media/${mediaAsset.yaml.path}`,
          method: 'get'
        })
        if (response.data) {
          master.$commit('addSvg', { uri: props.src, markup: response.data })
        }
      }
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['media/assetByUri'](props.src)
      return {
        src: props.src,
        svgPath: asset.yaml.path,
        svgTitle: asset.yaml.title,
        svgHttpUrl: asset.httpUrl,
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
      return buildSvgStepController(svgString, props).stepCount
    },
    afterSlideNoChangeOnComponent ({ newSlideNo }) {
      const slide = this.$store.getters['lamp/slideByNo'](newSlideNo)
      warnSvgWidthHeight(this.svgPath)
      this.stepController = buildSvgStepController(this.$el, slide.props)
    },
    afterStepNoChangeOnComponent ({ newStepNo }) {
      this.stepController.showUpTo(newStepNo)
    }
  }
})
