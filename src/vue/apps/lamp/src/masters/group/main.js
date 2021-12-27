/**
 * @module @bldr/lamp/masters/group
 */

import { validateMasterSpec } from '../../lib/masters'

function convertGroupIdToMediaId (groupId) {
  return `ref:GR_${groupId}`
}

export default validateMasterSpec({
  name: 'group',
  title: 'Gruppe',
  propsDef: {
    groupId: {
      type: String,
      required: true,
      description: 'Die ID der Gruppe (z. B. „Beatles_The“).'
    }
  },
  icon: {
    name: 'account-group',
    color: 'orange'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        return {
          groupId: props
        }
      }
      return props
    },
    resolveMediaUris (props) {
      return convertGroupIdToMediaId(props.groupId)
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['media/assetByUri'](convertGroupIdToMediaId(props.groupId))
      return { asset }
    },
    titleFromProps ({ propsMain }) {
      return propsMain.asset.yaml.name
    }
  }
})
