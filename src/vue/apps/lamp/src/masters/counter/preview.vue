<template>
  <div class="
    vc_counter_master_preview
    slide-preview-valign-center
    slide-preview-fullscreen
    sans
  ">
    <div class="inner">{{ fromFormatted }} - {{ toFormatted }}</div>
  </div>
</template>

<script lang="ts">
import type { Format } from './main'

import { Vue, Component, Prop } from '@bldr/vue-packages-bundler'

import { formatCounterNumber } from './main'

@Component
export default class CounterMasterPreview extends Vue {
  @Prop({
    type: Number,
    required: true
  })
  to!: number

  @Prop({
    type: String
  })
  format!: Format

  @Prop({
    type: String
  })
  toFormatted!: String

  get fromFormatted (): string {
    return formatCounterNumber(1, this.format)
  }
}
</script>

<style lang="scss">
  .vc_counter_master_preview {
    font-size: 7em;
  }
</style>
