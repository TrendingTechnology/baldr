<script lang="ts">
import { Component } from 'vue-property-decorator'

import { state } from './main.js'
import PlainIcon from './PlainIcon.vue'

@Component
export default class VanishIcon extends PlainIcon {
  state = state

  get classes (): string[] {
    const classes = this.getBaseClasses()
    classes.push('vc_vanish_icon')

    if (this.state.showIcons) {
      classes.push('show-icon')
    } else {
      classes.push('hide-icon')
    }
    return classes
  }
}
</script>

<style lang="scss">
.vc_vanish_icon {
  &.show-icon {
    opacity: 1;
    transition: 2s;
  }

  &.hide-icon {
    opacity: 0;
    transition: 2s;
  }
}
</style>
