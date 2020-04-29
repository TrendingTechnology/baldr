<template>
  <div class="vc_youtube_master">
    <h1 v-if="heading" v-html="heading"/>

    <p><span class="important">Quelle:</span> <a :href="`https://www.youtube.com/watch?v=${id}`" target="_blank">www.youtube.com/watch?v={{ id }}</a></p>
    <iframe
      :src="`https://www.youtube.com/embed/${id}`"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <p v-if="info" v-html="info"/>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    heading: {
      type: String
    },
    info: {
      type: String
    }
  }
}
</script>

<style lang="scss">
  .vc_youtube_master {
    text-align: center;

    iframe {
      width: 75%;
      height: 75%;
    }
  }
</style>
