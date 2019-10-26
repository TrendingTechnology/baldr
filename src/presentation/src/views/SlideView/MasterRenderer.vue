<script>
import OpenInterface from '@/components/OpenInterface'

export default {
  name: 'MasterRenderer',
  components: {
    OpenInterface
  },
  computed: {
    master () {
      let name
      let props
      let contentTheme
      let styleConfig

      const slide = this.$store.getters.slideCurrent
      if ('master' in this.$route.meta) {
        name = this.$route.meta.master
        props = this.$route.meta.data
        contentTheme = this.$masters[name].styleConfig.contentTheme
        styleConfig = this.$masters[name].styleConfig
      } else if (slide) {
        name = slide.master.name
        props = slide.renderData.data
        contentTheme = slide.contentTheme
        styleConfig = slide.master.styleConfig
      }
      return {
        name,
        props,
        styleConfig,
        contentTheme
      }
    }
  },
  methods: {
    setMasterStyle () {
      if (this.master.styleConfig) {
        this.$styleConfig.set(this.master.styleConfig)
      } else {
        this.$styleConfig.setDefaults()
      }
    }
  },
  render: function (createElement) {
    this.setMasterStyle()
    if (this.master.name) {
      return createElement(
        'div',
        {
          attrs: {
            'b-content-theme': this.master.contentTheme
          },
          class: {
            'vc_master_renderer': true,
          }
        },
        [
          createElement(
            `${this.master.name}-master`,
            {
              props: this.master.props,
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
