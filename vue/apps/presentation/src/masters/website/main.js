import { validateMasterSpec } from '../../lib/masters'

export default validateMasterSpec({
  name: 'website',
  title: 'Website',
  propsDef: {
    url: {
      type: String,
      required: true,
      description: 'Die URL der Website, die angezeigt werden soll.'
    }
  },
  icon: {
    name: 'master-website',
    color: 'blue'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = { url: props }
      }
      return props
    },
    plainTextFromProps (props) {
      return props.url
    }
  }
})
