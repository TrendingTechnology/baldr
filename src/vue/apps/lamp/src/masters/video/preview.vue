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

<script>
export default {
  props: {
    previewHttpUrl: {
      type: String
    },
    title: {
      type: String
    }
  }
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
