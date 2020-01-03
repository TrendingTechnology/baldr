<template>
  <div class="vc_video_master_preview slide-preview-wrapper">
    <img :src="previewHttpUrl" class="image-contain"/>
    <plain-icon name="play"/>
  </div>
</template>

<script>
export default {
  props: {
    previewHttpUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_video_master_preview {
    .baldr-icon {
      position: absolute;
      left: 1.2em;
      top: 0.6em;
      font-size: 6em;
      opacity: 0.5;
    }
  }
</style>
