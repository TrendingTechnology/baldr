/**
 * @module @bldr/lamp/masters/image
 */

import { GrabFromObjects } from '@/lib.js'

export default {
  title: 'Bild',
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Bild-Datei.',
      mediaFileUri: true
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
      description: 'Beeinflusst, ob Metainformation wie z. B. Titel oder Beschreibung angezeigt werden sollen.',
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
      const mediaFile = this.$store.getters['media/mediaFileByUri'](props.src)

      const grab = new GrabFromObjects(props, mediaFile)

      const title = grab.property('title')
      const description = grab.property('description')

      return {
        title,
        description,
        imageHttpUrl: mediaFile.httpUrl,
        noMeta: props.noMeta,
        mediaAsset: mediaFile
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        imageHttpUrl: propsMain.imageHttpUrl
      }
    },
    titleFromProps ({ props, propsMain }) {
      if (props.title) return props.title
      const asset = propsMain.mediaAsset
      if (asset.title) return asset.title
    },
    afterSlideNoChangeOnComponent ({ oldSlideNo, newSlideNo }) {
      function resetMetadataStyle (metaStyle) {
        metaStyle.width = null
        metaStyle.fontSize = null
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
        if (freeSpaceRatio > 1 + overlayZone) {
          this.$el.setAttribute('b-metadata-position', 'vertical')
          const width = this.$el.clientWidth - img.naturalWidth * scale
          resetMetadataStyle(metaStyle)
          metaStyle.width = `${width}px`
        } else if (freeSpaceRatio < 1 - overlayZone) {
          this.$el.setAttribute('b-metadata-position', 'horizontal')
          const height = this.$el.clientHeight - img.naturalHeight * scale
          resetMetadataStyle(metaStyle)
          metaStyle.height = `${height}px`
        } else {
          resetMetadataStyle(metaStyle)
          this.$el.setAttribute('b-metadata-position', 'overlay')
          // Metadata box which extends to more than 40 percent of the screen.
          if (this.$refs.metadata.clientHeight / this.$el.clientHeight > 0.3) {
            metaStyle.fontSize = '0.5em'
          }
        }
      }
    }
  }
}
