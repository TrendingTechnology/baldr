<template>
  <div class="vc_video_master">
    <!-- <video
      controls
      :src="httpUrl"
      :poster="previewHttpUrl"
    /> -->
  </div>
</template>

<script>
export default {
  props: {
    httpUrl: {
      type: String,
      required: true
    },
    previewHttpUrl: {
      type: String
    }
  }
}
</script>

<style lang="scss">
  .vc_video_master {
    text-align: center;

    video {
      bottom: 0;
      height: 100%;
      left: 0;
      object-fit: contain;
      position: absolute;
      width: 100%;
    }
  }
</style>
