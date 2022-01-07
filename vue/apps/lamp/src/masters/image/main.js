/**
 * @module @bldr/lamp/masters/image
 */
import { splitHtmlIntoChunks } from '@bldr/dom-manipulator'
import { ObjectPropertyPicker } from '@bldr/core-browser'
import { validateMasterSpec } from '../../lib/masters'

const DESCRIPTION_TEASER_LENGTH = 200

export default validateMasterSpec({
  name: 'image',
  title: 'Bild',
  propsDef: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Bild-Datei.',
      assetUri: true
    },
    title: {
      type: String,
      markup: true,
      description: 'Ein Titel, der angezeigt wird.'
    },
    description: {
      type: String,
      markup: true,
      description: 'Eine Beschreibung, die angezeigt wird.'
    },
    noMeta: {
      type: Boolean,
      description:
        'Beeinflusst, ob Metainformation wie z. B. Titel oder Beschreibung angezeigt werden sollen.',
      default: false
    }
  },
  icon: {
    name: 'image',
    color: 'green'
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
      return props.src
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['lamp/mediaNg/assetByUri'](props.src)

      const picker = new ObjectPropertyPicker(props, asset.meta)

      const title = picker.pickProperty('title')
      const description = picker.pickProperty('description')

      let descriptionTeaser = description
      let isLongDescription = false
      if (description) {
        let htmlChunks
        if (description.length > DESCRIPTION_TEASER_LENGTH) {
          htmlChunks = splitHtmlIntoChunks(
            description,
            DESCRIPTION_TEASER_LENGTH
          )
          descriptionTeaser = htmlChunks[0]
          if (htmlChunks.length > 1) {
            isLongDescription = true
          }
        }
      }

      return {
        title,
        description,
        descriptionTeaser,
        isLongDescription,
        imageHttpUrl: asset.httpUrl,
        noMeta: props.noMeta,
        mediaAsset: asset
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        imageHttpUrl: propsMain.imageHttpUrl
      }
    },
    titleFromProps ({ props, propsMain }) {
      if (props.title) {
        return props.title
      }
      const asset = propsMain.mediaAsset
      if (asset.meta.title) {
        return asset.meta.title
      }
    }
  }
})
