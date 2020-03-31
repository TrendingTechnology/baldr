<template>
  <div class="
    vc_song_master_preview
    slide-preview-fullscreen
  ">
    <img :src="imageHttpUrl"/>
  </div>
</template>

<script>
export default {
  props: {
    imageHttpUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
  .vc_song_master_preview {
    img {
      width: 90%;
      height: 90%;
      object-fit: contain;
      margin: 5%;
    }
  }
</style>
