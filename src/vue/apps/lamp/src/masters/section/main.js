/**
 * @module @bldr/lamp/masters/section
 */

import { convertHtmlToPlainText } from '@bldr/core-browser'

export default {
  title: 'Abschnitt',
  props: {
    heading: {
      type: String,
      required: true,
      markup: true,
      description: 'Die Überschrift / der Titel des Abschnitts.'
    }
  },
  icon: {
    name: 'file-tree',
    color: 'orange-dark'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = { heading: props }
      }
      return props
    },
    plainTextFromProps (props) {
      return convertHtmlToPlainText(props.heading)
    }
  }
}
