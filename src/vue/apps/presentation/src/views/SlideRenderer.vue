<script>
import QuoteMaster from '@/masters/QuoteMaster'

const components = {
  QuoteMaster
}

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
    masterName () {
      return this.$route.meta.master
    },
    masterData () {
      return this.$route.meta.data
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
