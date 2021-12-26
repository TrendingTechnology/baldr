<template>
  <div
    class="
    vc_counter_master_preview
    slide-preview-valign-center
    slide-preview-fullscreen
    sans
  "
  >
    <div class="inner">{{ fromFormatted }} - {{ toFormatted }}</div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { formatCounterNumber, Format } from './main'
import MasterPreview from '../../components/reusable/MasterPreview.vue'

@Component
export default class CounterMasterPreview extends MasterPreview {
  masterName = 'cloze'

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
  toFormatted!: string

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
