<script>
import OpenInterface from '@/components/OpenInterface'

export default {
  name: 'MasterRenderer',
  components: {
    OpenInterface
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
        return this.slideCurrent.renderData.name
      }
      return false
    },
    masterData () {
      if ('data' in this.$route.meta) {
        return this.$route.meta.data
      } else if (this.slideCurrent) {
        return this.slideCurrent.renderData.data
      }
      return {}
    }
  },
  methods: {
    setMasterStyle () {
      const master = this.$masters[this.masterName]
      if (master) {
        if ('styleConfig' in master) {
          this.$styleConfig.set(master.styleConfig)
        } else {
          this.$styleConfig.setDefaults()
        }
      }
    }
  },

  render: function (createElement) {
    this.setMasterStyle()
    if (this.masterName) {
      return createElement(
        'div',
        {
          attrs: {
            'b-content-theme': this.slideCurrent.contentTheme
          },
          class: {
            'vc_master_renderer': true,
          }
        },
        [
          createElement(
            `${this.masterName}-master`,
            {
              props: this.masterData,
              class: {
                'master-inner': true
              }
            }
          )
        ]
      )
    }
    return createElement('open-interface')
  }
}
</script>

<style lang="scss" scoped>
  .vc_master_renderer {
    box-sizing: border-box;
    display: table;
    font-size: 4vw;
    height: 100vh;
    width: 100vw;
  }
</style>

<style lang="scss">
  [b-center-vertically="true"] {
    .master-inner {
      display: table-cell;
      height: 100%;
      vertical-align: middle;
    }
  }
</style>

