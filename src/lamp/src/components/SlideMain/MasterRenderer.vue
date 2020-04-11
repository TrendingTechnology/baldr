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
  props: {
    slide: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['showBlank'])
  },
  methods: {
    setMasterStyle () {
      if (this.slide.master.styleConfig) {
        this.$styleConfig.set(this.slide.master.styleConfig)
      } else {
        this.$styleConfig.setDefaults()
      }
    }
  },
  render: function (createElement) {
    if (this.showBlank && this.slide.masterName) {
      return createElement('blank-master')
    }
    this.setMasterStyle()
    if (this.slide.masterName) {
      const masterElement = createElement(
        `${this.slide.masterName}-master-main`,
        {
          props: this.slide.propsMain,
          class: {
            'master-inner': true
          },
          style: this.slide.style
        }
      )
      return createElement(
        'div',
        {
          attrs: {
            'b-content-theme': this.slide.contentTheme
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
