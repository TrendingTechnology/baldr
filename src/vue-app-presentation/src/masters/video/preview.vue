<template>
  <div class="vc_video_master_preview">
    <img
      v-if="previewHttpUrl"
      :src="previewHttpUrl"
      class="image-contain"
    />
    <slide-preview-play-button/>
  </div>
</template>

<script>
export default {
  props: {
    previewHttpUrl: {
      type: String
    }
  }
}
</script>
