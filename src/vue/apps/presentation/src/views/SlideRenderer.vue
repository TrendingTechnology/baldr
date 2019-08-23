<script>
import { components } from '@/masters.js'
import { mapGetters } from 'vuex'

function toClassName (masterName) {
  const titleCase = masterName.charAt(0).toUpperCase() + masterName.substr(1).toLowerCase()
  return `${titleCase}Master`
}

function masterOptions (masterName) {
  return components[toClassName(masterName)]
}

export default {
  name: 'SlideRenderer',
  components,
  computed: {
    ...mapGetters(['slideCurrent']),
    masterName () {
      if ('master' in this.$route.meta) {
        return this.$route.meta.master
      }
      return this.slideCurrent.master.name
    },
    masterData () {
      if ('data' in this.$route.meta) {
        return this.$route.meta.data
      }
      return this.slideCurrent.master.data
    }
  },
  created: function () {
    const options = masterOptions(this.masterName)
    this.$centerVertically.set(options.centerVertically)
    this.$darkMode.set(options.darkMode)
  },
  render: function (createElement) {
    return createElement(
      `${this.masterName}-master`,
      {
        props: this.masterData
      }
    )
  }
}
</script>
