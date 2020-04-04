<script>
import LoadingIcon from '@/components/LoadingIcon'
import BlankMaster from '@/components/BlankMaster'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'MasterRenderer',
  components: {
    BlankMaster,
    LoadingIcon
  },
  computed: {
    ...mapGetters(['slide', 'showBlank']),
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
      } else if (this.slide) {
        return {
          name: this.slide.master.name,
          propsMain: this.slide.propsMain,
          contentTheme: this.slide.contentTheme,
          styleConfig: this.slide.master.styleConfig,
          styleInline: this.slide.style
        }
      }
      return {}
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
            vc_master_renderer: true
          }
        },
        [masterElement]
      )
    }
    return createElement('loading-icon')
  }
}
</script>

<style lang="scss">
  .vc_master_renderer {
    box-sizing: border-box;
    display: table;
    font-size: 4vw;
    height: 100vh;
    width: 100vw;
  }

  [b-center-vertically="true"] {
    .master-inner {
      display: table-cell;
      height: 100%;
      vertical-align: middle;
    }
  }
</style>
