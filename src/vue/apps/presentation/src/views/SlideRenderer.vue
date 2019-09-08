<script>
import { mapGetters } from 'vuex'

import OpenNewPresentation from '@/views/OpenFiles.vue'

export default {
  name: 'SlideRenderer',
  components: {
    OpenNewPresentation
  },
  computed: {
    ...mapGetters(['slideCurrent']),
    masterName () {
      if ('master' in this.$route.meta) {
        return this.$route.meta.master
      } else if (this.slideCurrent) {
        return this.slideCurrent.master.name
      }
      return false
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
    if (master) {
      this.$centerVertically.set(master.centerVertically)
      this.$darkMode.set(master.darkMode)
      if ('slidePadding' in master) {
        this.$slidePadding.set(master.slidePadding)
      } else {
        this.$slidePadding.default()
      }
    }
  },
  render: function (createElement) {
    if (this.masterName) {
      return createElement(
        `${this.masterName}-master`,
        {
          props: this.masterData
        }
      )
    }
    return createElement('open-files')
  }
}
</script>
