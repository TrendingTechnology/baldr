/**
 * @module @bldr/lamp/masters/cloze
 */

/* globals DOMParser */

import Vue from 'vue'

import { MediaUri } from '@bldr/client-media-models'
import { validateMasterSpec } from '@bldr/lamp-core'
import { mapStepFieldDefintions } from '@bldr/presentation-parser'
import { Controller, ClozeSelector } from '@bldr/dom-manipulator'

import { warnSvgWidthHeight } from '@/lib.js'

function instaniateStepController (entry, stepSubset) {
  const selector = new ClozeSelector(entry)
  return new Controller(selector.select(), stepSubset)
}

/**
 * @param {HTMLElement} componentElement - The parent component element.
 *   `<div class="vc_cloze_master master-inner">`
 * @param {HTMLElement} scrollContainer
 * @param {Object} clozeGroup
 */
export function scrollToClozeGroup (
  componentElement,
  scrollContainer,
  clozeGroup
) {
  if (!clozeGroup) return

  // e. g.: 1892
  // svg.clientHeight
  const svg = componentElement.querySelector('svg')
  // e. g.: 794.4473876953125
  // bBox.height
  const bBox = svg.getBBox()
  const glyph = clozeGroup.children[0]
  // e. g.: 125.11000061035156
  const glyphOffsetTopSvg =
    (svg.clientHeight / bBox.height) * glyph.y.baseVal.value
  const scrollToTop = glyphOffsetTopSvg - 0.8 * scrollContainer.clientHeight
  scrollContainer.scrollTo({ top: scrollToTop, left: 0, behavior: 'smooth' })
}

export default validateMasterSpec({
  name: 'cloze',
  title: 'Lückentext',
  propsDef: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
      assetUri: true
    },
    ...mapStepFieldDefintions(['subset'])
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
      const uri = new MediaUri(props.src)
      if (uri.fragment != null) {
        if (props.stepSubset == null) props.stepSubset = uri.fragment
        props.src = uri.uriWithoutFragment
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
        asset,
        src: props.src,
        svgPath: asset.yaml.path,
        svgHttpUrl: asset.httpUrl
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        svgHttpUrl: propsMain.svgHttpUrl
      }
    },
    calculateStepCount ({ props, master }) {
      const svgString = master.$get('svgByUri')(props.src)
      return instaniateStepController(svgString, props.stepSubset).count
    },
    titleFromProps ({ propsMain }) {
      if (propsMain.asset.yaml.title) {
        return propsMain.asset.yaml.title
      }
    },
    afterSlideNoChangeOnComponent ({ newSlideNo }) {
      const slide = this.$store.getters['lamp/slideByNo'](newSlideNo)
      warnSvgWidthHeight()
      this.stepController = instaniateStepController(this.$el, slide.props.stepSubset)
    },
    afterStepNoChangeOnComponent ({ newStepNo }) {
      const newClozeGroup = this.stepController.showUpTo(newStepNo)
      // <div class="vc_slide_main">
      //   <div class="vc_master_renderer">
      //     <div class="vc_cloze_master master-inner">
      const scrollContainer = this.$el.parentElement.parentElement
      scrollToClozeGroup(this.$el, scrollContainer, newClozeGroup)
    }
  }
})
