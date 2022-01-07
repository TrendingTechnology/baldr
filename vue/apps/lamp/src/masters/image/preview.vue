<template>
  <div
    class="
    vc_image_master_preview
    slide-preview-fullscreen
  "
  >
    <img :src="imageHttpUrl" class="image-contain" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class ImageMasterPreview extends MasterPreview {
  masterName = 'image'

  @Prop({
    type: String
  })
  imageHttpUrl: string
}
</script>
