<template>
  <div class="vc_youtube_master">
    <iframe
      :src="`https://www.youtube.com/embed/${id}`"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_youtube_master {
    text-align: center;

    iframe {
      width: 75vw;
      height: 75vh;
    }
  }
</style>
