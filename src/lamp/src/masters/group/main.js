/**
 * @module @bldr/lamp/masters/group
 */

function convertGroupIdToMediaId (groupId) {
  return `id:GR_${groupId}`
}

export default {
  title: 'Gruppe',
  props: {
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
      return propsMain.asset.name
    }
  }
}
