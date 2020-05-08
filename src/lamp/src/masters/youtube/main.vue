<template>
  <div class="vc_youtube_master">
    <div class="source smaller">
      <span class="important">Quelle:</span>
      <a :href="`https://www.youtube.com/watch?v=${id}`" target="_blank">
        www.youtube.com/watch?v={{ id }}
      </a>
    </div>

    <h1 v-if="heading" v-html="heading"/>

    <iframe
      :src="`https://www.youtube.com/embed/${id}`"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      frameborder="0"
      v-if="!asset"
    />
    <div id="youtube-offline-video"/>
    <p v-if="info" v-html="info"/>
  </div>
</template>

<script>
export default {
  props: {
    asset: {
      type: Object
    },
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

    .source {
      position: absolute;
      top: 0.8em;
      left: 4em;
    }
  }
</style>
