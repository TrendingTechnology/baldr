<template>
  <div
    class="
    vc_song_master_preview
    slide-preview-fullscreen
  "
  >
    <h2>{{ title }}</h2>
    <img :src="imageHttpUrl" />
  </div>
</template>

<script>
export default {
  props: {
    imageHttpUrl: {
      type: String,
      required: true
    },
    title: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.vc_song_master_preview {
  h2 {
    position: absolute;
    text-align: center;
    width: 100%;
  }

  img {
    height: 90%;
    margin: 5%;
    object-fit: contain;
    width: 90%;
  }
}
</style>
