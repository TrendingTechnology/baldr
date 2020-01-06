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
    data_ () {
      if ('master' in this.$route.meta) {
        const masterName = this.$route.meta.master
        const master = this.$masters.get(masterName)
        return {
          name: masterName,
          propsMain: this.$route.meta.data,
          contentTheme: master.styleConfig.contentTheme,
          styleConfig: master.styleConfig,
          styleInline: {}
        }
      } else if (this.slideCurrent) {
        return {
          name: this.slideCurrent.master.name,
          propsMain: this.slideCurrent.renderData.propsMain,
          contentTheme: this.slideCurrent.contentTheme,
          styleConfig: this.slideCurrent.master.styleConfig,
          styleInline: this.slideCurrent.style
        }
      }
    },
    masterName () {
      return this.data_.name
    },
    propsMain () {
      return this.data_.propsMain
    },
    styleConfig () {
      return this.data_.styleConfig
    },
    contentTheme () {
      return this.data_.contentTheme
    },
    styleInline () {
      return this.data_.styleInline
    }
  },
  methods: {
    setMasterStyle () {
      if (this.styleConfig) {
        this.$styleConfig.set(this.styleConfig)
      } else {
        this.$styleConfig.setDefaults()
      }
    }
  },
  render: function (createElement) {
    if (this.showBlank && this.masterName) {
      return createElement('blank-master')
    }
    this.setMasterStyle()
    if (this.masterName) {
      const masterElement = createElement(
        `${this.masterName}-master-main`,
        {
          props: this.propsMain,
          class: {
            'master-inner': true
          },
          style: this.styleInline
        }
      )
      return createElement(
        'div',
        {
          attrs: {
            'b-content-theme': this.contentTheme
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
