<script lang="ts">
import { Component } from '@bldr/vue-packages-bundler'

import PlainIcon from './PlainIcon.vue'

@Component
export default class VanishIcon extends PlainIcon {
  get classes (): string[] {
    const classes = this.getBaseClasses()
    classes.push('vc_vanish_icon')

    if (this.state.vanishIcons) {
      classes.push('vanish-icon')
    } else {
      classes.push('not-vanish-icon')
    }
    return classes
  }
}
</script>

<style lang="scss">
.vc_vanish_icon {
  &.not-vanish-icon {
    opacity: 1;
    transition: 1s;
  }

  &.vanish-icon {
    opacity: 0;
    transition: 1s;
  }
}
</style>
