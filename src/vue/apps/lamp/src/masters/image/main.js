/**
 * @module @bldr/lamp/masters/image
 */
import { splitHtmlIntoChunks } from '@bldr/dom-manipulator'
import { ObjectPropertyPicker } from '@bldr/core-browser'
import { validateMasterSpec } from '@bldr/lamp-core'

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
      const asset = this.$store.getters['media/assetByUri'](props.src)

      const picker = new ObjectPropertyPicker(props, asset.yaml)

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
      if (asset.yaml.title) {
        return asset.yaml.title
      }
    },
    afterSlideNoChangeOnComponent ({}) {
      // overlay
      const slide = this.$get('slide')

      // This variable indicates if in the prop description is a lot of text.
      let lotOfText = false
      if (
        slide.propsMain.description &&
        slide.propsMain.description.length > 400
      ) {
        lotOfText = true
      }

      function resetMetadataStyle (metaStyle) {
        metaStyle.width = null
        if (!lotOfText) {
          metaStyle.fontSize = null
        } else {
          metaStyle.fontSize = '0.8em'
        }
        metaStyle.height = null
      }

      if (this.$refs.image) {
        const img = this.$refs.image

        // aspectRatio > 1 = 'landscape'
        // aspectRatio < 1 = 'protrait'
        const imgAspectRatio = img.naturalWidth / img.naturalHeight
        const frameAspectRatio = this.$el.clientWidth / this.$el.clientHeight
        // vertical // left / right free space > 1
        // horicontal // top / bottom free space < 1
        const freeSpaceRatio = frameAspectRatio / imgAspectRatio

        var scale = Math.min(
          this.$el.clientWidth / img.naturalWidth,
          this.$el.clientHeight / img.naturalHeight
        )

        const metaStyle = this.$refs.metadata.style

        const overlayZone = 0.3
        // vertical
        if (freeSpaceRatio > 1 + overlayZone) {
          this.$el.setAttribute('b-metadata-position', 'vertical')
          const width = this.$el.clientWidth - img.naturalWidth * scale
          resetMetadataStyle(metaStyle)
          metaStyle.width = `${width}px`
          // horizontal
        } else if (freeSpaceRatio < 1 - overlayZone) {
          this.$el.setAttribute('b-metadata-position', 'horizontal')
          const height = this.$el.clientHeight - img.naturalHeight * scale
          resetMetadataStyle(metaStyle)
          metaStyle.height = `${height}px`
          // overlay
        } else {
          resetMetadataStyle(metaStyle)
          this.$el.setAttribute('b-metadata-position', 'overlay')
          // Metadata box which extends to more than 40 percent of the screen.
          if (this.$refs.metadata.clientHeight / this.$el.clientHeight > 0.3) {
            metaStyle.fontSize = '0.7em'
          }
        }
      }
    }
  }
})
