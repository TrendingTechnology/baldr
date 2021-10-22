<script lang="ts">
import { Component } from 'vue-property-decorator'

import { state } from './main.js'
import PlainIcon from './PlainIcon.vue'

@Component
export default class VanishIcon extends PlainIcon {
  state = state

  get classes (): string[] {
    let classes = [
      'baldr-icon',
      'vc_vanish_icon',
      `baldr-icon_${this.name}`
    ]
    if (this.state.isMouseActive) {
      classes.push('text-red')
    }
    return classes
  }
}
</script>
