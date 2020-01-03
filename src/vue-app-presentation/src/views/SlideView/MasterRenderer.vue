<script>
import OpenInterface from '@/components/OpenInterface'
import BlankMaster from '@/components/BlankMaster'
import vue from '@/main.js'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'MasterRenderer',
  components: {
    BlankMaster,
    OpenInterface
  },
  computed: {
    ...mapGetters(['slideCurrent', 'showBlank']),
    master () {
      let name
      let props
      let contentTheme
      let styleConfig
      let styleInline

      if ('master' in this.$route.meta) {
        name = this.$route.meta.master
        props = this.$route.meta.data
        contentTheme = this.$masters.get(name).styleConfig.contentTheme
        styleConfig = this.$masters.get(name).styleConfig
        styleInline = {}
      } else if (this.slideCurrent) {
        name = this.slideCurrent.master.name
        props = this.slideCurrent.renderData.props
        contentTheme = this.slideCurrent.contentTheme
        styleConfig = this.slideCurrent.master.styleConfig
        styleInline = this.slideCurrent.style
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
    if (this.showBlank && this.master.name) {
      return createElement('blank-master')
    }
    this.setMasterStyle()
    if (this.master.name) {
      let masterElement
      if (`${this.master.name}-master-main` in vue.$options.components) {
        masterElement = createElement(
          `${this.master.name}-master-main`,
          {
            props: this.slideCurrent.renderData.propsMain,
            class: {
              'master-inner': true
            },
            style: this.master.styleInline
          }
        )
      } else {
        masterElement = createElement(
          `${this.master.name}-master`,
          {
            props: this.master.props,
            class: {
              'master-inner': true
            },
            style: this.master.styleInline
          }
        )
      }
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
        [masterElement]
      )
    }
    return createElement('open-interface', {
      attrs: {
        'b-content-theme': 'default'
      }
    })
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

  .vc_open_interface {
    box-sizing: border-box;
    display: table-cell;
    height: 100vh;
    padding: 4vw;
    vertical-align: middle;
    width: 100vw;
  }
</style>

<style lang="scss">
  .vc_open_interface {
    // Input is to small
    input.search {
      font-size: 2vw !important;
    }
  }
  [b-center-vertically="true"] {
    .master-inner {
      display: table-cell;
      height: 100%;
      vertical-align: middle;
    }
  }
</style>
