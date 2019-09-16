<script>
import OpenFiles from '@/views/OpenFiles.vue'

export default {
  name: 'MasterRenderer',
  components: {
    OpenFiles
  },
  computed: {
    slideCurrent () {
      if (this.$store.getters.slideCurrent) {
        return this.$store.getters.slideCurrent
      }
      return false
    },
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
      } else if (this.slideCurrent) {
        return this.slideCurrent.master.data
      }
      return {}
    }
  },
  created: function () {
    const master = this.$masters[this.masterName]
    if (master) {
      if ('styleConfig' in master) {
        this.$styleConfig.set(master.styleConfig)
      } else {
        this.$styleConfig.setDefaults()
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
