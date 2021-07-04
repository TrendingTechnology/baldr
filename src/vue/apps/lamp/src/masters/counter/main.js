/**
 * @module @bldr/lamp/masters/counter
 */

import { validateMasterSpec } from '@bldr/lamp-core'
import { styleConfigurator } from '@bldr/style-configurator'

export default validateMasterSpec({
  name: 'counter',
  title: 'Zähler',
  propsDef: {
    to: {
      type: Number,
      required: true,
      description: 'Zähle bis zu dieser Zahl.'
    }
  },
  icon: {
    name: 'counter',
    color: 'black',
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
          to: parseInt(props)
        }
      } else if (typeof props === 'number') {
        props = {
          to: props
        }
      }
      return props
    },
    calculateStepCount ({ props }) {
      return props.to
    },
    plainTextFromProps (props) {
      return `${props.to}`
    },
    afterStepNoChangeOnComponent() {
      styleConfigurator.toggleDarkMode()
    }
  }
})
