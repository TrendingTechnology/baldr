<script lang="ts">
import Vue, { VNode, CreateElement }  from 'vue'

import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import LoadingIcon from '@/components/reusable/LoadingIcon.vue'

@Component({
  components: {
    LoadingIcon
  }
})
export default class MasterRenderer extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  slide: any

  /**
   *  All main master components have a prop named `navigationNumbers`.
   *  This prop is set in `MasterMain.vue`
   */
  @Prop({
    type: Number
  })
  stepNo: number

  @Prop({
    type: Boolean,
    default: true
  })
  isPublic: boolean

  render (createElement: CreateElement): VNode {
    if (this.slide.masterName) {
      const masterElement = createElement(
        `${this.slide.masterName}-master-main`,
        {
          props: {
            ...this.slide.propsMain,
            slide: this.slide,
            navigationNumbers: { stepNo: this.stepNo, slideNo: this.slide.no },
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

[b-center-vertically='true'] {
  .master-inner {
    display: table-cell;
    height: 100%;
    vertical-align: middle;
  }
}
</style>
