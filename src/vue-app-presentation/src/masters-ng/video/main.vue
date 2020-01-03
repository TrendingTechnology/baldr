<template>
  <div class="vc_video_master">
    <video v-if="mediaFile" controls :src="mediaFile.httpUrl"/>
  </div>
</template>

<script>
export default {
  props: {
    httpUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_video_master {
    text-align: center;

    video {
      bottom: 0;
      height: 100vh;
      left: 0;
      object-fit: contain;
      position: absolute;
      width: 100vw;
    }
  }
</style>
