<template>
  <div
    class="
    vc_cloze_master_preview
    slide-preview-valign-top
  "
  >
    <img :src="svgHttpUrl" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class ClozeMasterPreview extends MasterPreview {
  masterName = 'cloze'

  @Prop({
    type: String,
    required: true
  })
  svgHttpUrl: string
}
</script>

<style lang="scss">
.vc_cloze_master_preview {
  img {
    background-color: white;
  }
}
</style>
