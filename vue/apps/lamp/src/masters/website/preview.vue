<template>
  <div
    class="
    slide-preview-fullscreen
    slide-preview-valign-center
    vc_website_master_preview
  "
  >
    {{ url }}
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class WebsiteMasterPreview extends MasterPreview {
  masterName = 'website'

  @Prop({
    type: String
  })
  url!: string
}
</script>
