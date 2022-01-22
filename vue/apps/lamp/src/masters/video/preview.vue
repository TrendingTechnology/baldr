<template>
  <div
    class="
    vc_video_master_preview
    slide-preview-fullscreen
  "
  >
    <img v-if="previewHttpUrl" :src="previewHttpUrl" class="image-contain" />
    <slide-preview-play-button />
    <p class="important font-shadow" v-if="title" v-html="title" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class VideoMasterPreview extends MasterPreview {
  masterName = 'video'

  @Prop({
    type: String
  })
  previewHttpUrl!: string

  @Prop({
    type: String
  })
  title!: string
}
</script>

<style lang="scss">
.vc_video_master_preview {
  text-align: center;

  p {
    bottom: 0%;
    font-size: 170%;
    left: 10%;
    position: absolute;
  }
}
</style>
