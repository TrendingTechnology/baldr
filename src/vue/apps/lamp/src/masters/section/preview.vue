<template>
  <div
    class="
    vc_section_master_preview
    slide-preview-fullscreen
    slide-preview-valign-center
  "
  >
    <div class="inner" v-html="heading" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class SectionMasterPreview extends MasterPreview {
  masterName = 'section'

  @Prop({
    type: String,
    required: true
  })
  heading: string
}
</script>

<style lang="scss">
.vc_section_master_preview {
  font-family: $font-family-sans-small-caps;
  font-size: 1.5em;
  font-weight: bold;
}
</style>
