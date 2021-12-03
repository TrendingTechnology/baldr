<template>
  <div class="vc_vanish_demonstration">
    <h2>VanishIcon</h2>
    <vanish-icon name="baldr" />

    <span v-for="icon in iconNames" :key="icon" :name="icon">
      <vanish-icon :name="icon" />
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VanishIcon from '@/components/plugin/VanishIcon.vue'
import iconNames from '@/icons.json'
import { registerMouseMoveTimeout } from '@/plugin.js'

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
