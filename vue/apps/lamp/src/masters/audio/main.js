/**
 *
 * Waveform visualizers
 *
 * - {@link https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/}
 * - {@link https://waveform.prototyping.bbc.co.uk/}
 * @module @bldr/lamp/masters/audio
 */

import { ObjectPropertyPicker } from '@bldr/core-browser'

import { validateMasterSpec } from '../../lib/masters'
export default validateMasterSpec({
  name: 'audio',
  title: 'Hörbeispiel',
  propsDef: {
    src: {
      type: [String, Array],
      required: true,
      description: 'Eine Medien-Datei-URI, z. B. `ref:Fuer-Elise` oder eine Sample-URI (`ref:Fuer-Elise#complete`).',
      assetUri: true
    },
    title: {
      type: String,
      markup: true,
      description: 'Der Titel des Audio-Ausschnitts.',
      required: true
    },
    composer: {
      type: String,
      markup: true,
      description: 'Der/Die KomponistIn des Audio-Ausschnitts.'
    },
    artist: {
      type: String,
      markup: true,
      description: 'Der/Die InterpretIn des Audio-Ausschnitts.'
    },
    partOf: {
      type: String,
      markup: true,
      description: 'Teil eines übergeordneten Werks.'
    },
    cover: {
      type: String,
      description: 'Eine Medien-Datei-URI, die als Cover-Bild angezeigt werden soll.',
      assetUri: true
    },
    description: {
      type: String,
      markup: true,
      description: 'Ein längerer Beschreibungstext.'
    },
    autoplay: {
      type: Boolean,
      default: false,
      description: 'Den Audio-Ausschnitt automatisch abspielen.'
    },
    playthrough: {
      type: Boolean,
      default: false,
      description: 'Über die Folien hinwegspielen. Nicht stoppen beim Folienwechsel.'
    }
  },
  icon: {
    name: 'music',
    color: 'brown'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = { src: props }
      }
      return props
    },
    resolveMediaUris (props) {
      const uris = new Set([props.src])
      if (props.cover) uris.add(props.cover)
      return uris
    },
    collectPropsMain (props) {
      const sample = this.$store.getters['lamp/mediaNg/sampleByUri'](props.src)
      const asset = sample.asset

      const grab = new ObjectPropertyPicker(props, asset.meta)
      const artist = grab.pickProperty('artist')
      const composer = grab.pickProperty('composer')
      const description = grab.pickProperty('description')
      const partOf = grab.pickProperty('partOf')

      let title
      if (props.title != null) {
        title = props.title
      } else {
        title = sample.titleSafe
      }

      let previewHttpUrl
      if (props.cover != null) {
        const coverFile = this.$store.getters['lamp/mediaNg/assetByUri'](props.cover)
        previewHttpUrl = coverFile.httpUrl
      } else if (asset.previewHttpUrl != null) {
        previewHttpUrl = asset.previewHttpUrl
      }
      return {
        sample,
        previewHttpUrl,
        waveformHttpUrl: asset.waveformHttpUrl,
        artist,
        composer,
        title,
        partOf,
        description,
        mediaAsset: asset
      }
    },
    titleFromProps ({ props, propsMain }) {
      if (props.title != null) {
        return props.title
      }
      const asset = propsMain.mediaAsset
      if (asset.meta.title != null) {
        return asset.meta.title
      }
    }
  }
})
