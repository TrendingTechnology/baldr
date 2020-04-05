/**
 * @module @bldr/lamp/masters/task
 */

import { plainText } from '@bldr/core-browser'

export default {
  title: 'Arbeitsauftrag',
  props: {
    markup: {
      type: String,
      required: true,
      markup: true,
      description: 'Text im HTML oder Markdown-Format oder als reinen Text.'
    }
  },
  icon: {
    name: 'comment-alert',
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
      return plainText(props.markup)
    }
  }
}
