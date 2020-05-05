/**
 * Download videos in the mp4 container
 *
 *    youtube-dl -f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4' 3XzGNabztj8
 *
 * @module @bldr/lamp/masters/youtube
 */

export default {
  title: 'YouTube',
  props: {
    id: {
      type: String,
      required: true,
      description: 'Die Youtube-ID (z. B. xtKavZG1KiM).'
    },
    heading: {
      type: String,
      description: 'Eigene Überschrift',
      markup: true
    },
    info: {
      type: String,
      description: 'längerer Informations-Text',
      markup: true
    }
  },
  icon: {
    name: 'youtube',
    color: 'red'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = { id: props }
      }
      return props
    },
    plainTextFromProps (props) {
      return props.id
    }
  }
}
