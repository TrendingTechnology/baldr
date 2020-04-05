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
        noMeta: props.noMeta
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        imageHttpUrl: propsMain.imageHttpUrl
      }
    }
  }
}
