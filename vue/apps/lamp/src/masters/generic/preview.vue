<template>
  <div
    class="
      vc_generic_master_preview
      slide-preview-valign-top
      slide-preview-fix-typography
      slide-preview-fullscreen
    "
    v-html="markup"
  />
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class GenericMasterPreview extends MasterPreview {
  masterName = 'generic'

  @Prop({
    type: String,
    required: true
  })
  markup!: string
}
</script>
