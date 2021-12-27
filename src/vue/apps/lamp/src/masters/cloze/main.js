/**
 * @module @bldr/lamp/masters/cloze
 */

/* globals DOMParser */

import Vue from 'vue'

import { MediaUri } from '@bldr/client-media-models'
import { validateMasterSpec } from '../../lib/masters'
import { mapStepFieldDefintions } from '@bldr/presentation-parser'
import { buildClozeStepController } from '@bldr/dom-manipulator'
import * as api from '@bldr/api-wrapper'

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
        const markup = await api.readMediaAsString(mediaAsset.yaml.path)
        if (markup != null) {
          master.$commit('addSvg', { uri: props.src, markup })
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
      return buildClozeStepController(svgString, props.stepSubset).stepCount
    },
    titleFromProps ({ propsMain }) {
      if (propsMain.asset.yaml.title) {
        return propsMain.asset.yaml.title
      }
    }
  }
})
