<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import PlainIcon from './PlainIcon.vue'

@Component
export default class ClickableIcon extends PlainIcon {
  @Prop({
    type: Boolean,
    default: false
  })
  disabled!: boolean

  get classes (): string[] {
    const classes = this.getBaseClasses()
    classes.push('vc_clickable_icon')
    if (this.disabled) {
      classes.push('disabled')
    }
    return classes
  }
}
</script>

<style lang="scss">
.vc_clickable_icon {
  cursor: pointer;

  &:not(.disabled):hover {
    color: $red !important;
  }

  &:not(.disabled):active {
    color: $blue !important;
  }

  &.disabled {
    color: scale-color($black, $lightness: 70%) !important;
  }
}
</style>
