/**
 * @module @bldr/lamp/masters/section
 */

import { convertHtmlToPlainText } from '@bldr/string-format'
import { validateMasterSpec } from '../../lib/masters'

export default validateMasterSpec({
  name: 'section',
  title: 'Abschnitt',
  propsDef: {
    heading: {
      type: String,
      required: true,
      markup: true,
      description: 'Die Überschrift / der Titel des Abschnitts.'
    }
  },
  icon: {
    name: 'master-section',
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
})
