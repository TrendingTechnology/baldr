<script>
import LoadingIcon from '@/components/LoadingIcon'

export default {
  name: 'MasterRenderer',
  components: {
    LoadingIcon
  },
  props: {
    slide: {
      type: Object,
      required: true
    },
    // All main master components have a prop named `stepNo`. This
    // prop is mixed in `masters.js`
    stepNo: {
      type: Number
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  render: function (createElement) {
    if (this.slide.masterName) {
      const masterElement = createElement(
        `${this.slide.masterName}-master-main`,
        {
          props: {
            ...this.slide.propsMain,
            navNos: { stepNo: this.stepNo, slideNo: this.slide.no },
            isPublic: this.isPublic
          },
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
    width: 100%;
  }

  [b-center-vertically="true"] {
    .master-inner {
      display: table-cell;
      height: 100%;
      vertical-align: middle;
    }
  }
</style>
