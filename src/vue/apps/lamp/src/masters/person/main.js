/**
 * @module @bldr/lamp/masters/person
 */

function convertPersonIdToMediaId (personId) {
  return `id:PR_${personId}`
}

export default {
  title: 'Porträt',
  props: {
    personId: {
      type: String,
      description: 'Personen-ID (z. B. Beethoven_Ludwig-van).'
    }
  },
  icon: {
    name: 'clipboard-account',
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
          personId: props
        }
      }
      return props
    },
    resolveMediaUris (props) {
      return convertPersonIdToMediaId(props.personId)
    },
    collectPropsMain (props) {
      const asset = this.$store.getters['media/assetByUri'](convertPersonIdToMediaId(props.personId))
      return { asset }
    },
    titleFromProps ({ propsMain }) {
      return propsMain.asset.name
    }
  }
}
