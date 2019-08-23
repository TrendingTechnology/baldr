<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SlideRenderer',
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
    const master = this.$masters[this.masterName]
    this.$centerVertically.set(master.centerVertically)
    this.$darkMode.set(master.darkMode)
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
