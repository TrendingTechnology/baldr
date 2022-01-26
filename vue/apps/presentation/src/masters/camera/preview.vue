<template>
  <div
    class="
    vc_camera_master_preview
    slide-preview-valign-center
    slide-preview-fullscreen
  "
  >
    <plain-icon name="master-camera" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class CameraMasterPreview extends MasterPreview {
  masterName = 'camera'
}
</script>

<style lang="scss">
.vc_camera_master_preview {
  .baldr-icon {
    font-size: 10em;
  }
}
</style>
