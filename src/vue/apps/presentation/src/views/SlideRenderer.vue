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
  render: function (createElement) {
    const masterName = this.$route.meta.master
    const masterData = this.$route.meta.data
    this.$centerVertically(masterOptions(masterName).centerVertically)
    return createElement(
      `${masterName}-master`,
      {
        props: masterData
      }
    )
  }
}
</script>
