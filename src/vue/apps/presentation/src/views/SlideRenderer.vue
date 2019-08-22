<script>
import QuoteMaster from '@/masters/QuoteMaster'

export default {
  name: 'SlideRenderer',
  components: {
    QuoteMaster
  },
  render: function (createElement) {
    console.log(this.$router)
    const masterName = this.$route.meta.master
    const masterData = this.$route.meta.data
    return createElement(
      `${masterName}-master`,
      {
        props: masterData
      }
    )
  }
}
</script>
