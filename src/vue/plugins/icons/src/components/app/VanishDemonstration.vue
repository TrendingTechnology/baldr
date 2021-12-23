<template>
  <div class="vc_vanish_demonstration">
    <h1>VanishIcon</h1>
    <vanish-icon name="baldr" />

    <span v-for="icon in iconNames" :key="icon" :name="icon">
      <vanish-icon :name="icon" />
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import VanishIcon from '@/components/plugin/VanishIcon.vue'
import iconNames from '../../icons.json'
import { registerMouseMoveTimeout } from '../../plugin.js'

@Component({ components: { VanishIcon } })
export default class VanishDemonstration extends Vue {
  get iconNames (): string[] {
    return iconNames
  }

  mounted (): void {
    registerMouseMoveTimeout(1)
  }
}
</script>

<style lang="scss">
.vc_vanish_demonstration {
  .baldr-icon {
    font-size: 4em;
  }
}
</style>
