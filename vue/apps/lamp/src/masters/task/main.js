/**
 * @module @bldr/lamp/masters/task
 */

import { convertHtmlToPlainText } from '@bldr/string-format'

import { validateMasterSpec } from '../../lib/masters'

export default validateMasterSpec({
  name: 'task',
  title: 'Arbeitsauftrag',
  propsDef: {
    markup: {
      type: String,
      required: true,
      markup: true,
      description: 'Text im HTML oder Markdown-Format oder als reinen Text.'
    }
  },
  icon: {
    name: 'task',
    color: 'yellow-dark',
    size: 'large'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = {
          markup: props
        }
      }
      return props
    },
    plainTextFromProps (props) {
      return convertHtmlToPlainText(props.markup)
    }
  }
})
