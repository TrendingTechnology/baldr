<template>
  <div class="vc_youtube_master main-app-padding">
    <div class="source smaller">
      <span class="important">Quelle:</span>
      <a :href="`https://www.youtube.com/watch?v=${id}`" target="_blank">
        youtu.be/{{ youtubeId }}
      </a>
    </div>

    <h1 class="heading" v-if="heading" v-html="heading"/>

    <iframe
      :src="`https://www.youtube.com/embed/${id}`"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      frameborder="0"
      v-if="!asset"
    />
    <div v-if="asset" id="youtube-offline-video"/>
    <p class="small" v-if="info" v-html="info"/>
  </div>
</template>

<script>
export default {
  props: {
    asset: {
      type: Object
    },
    youtubeId: {
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

    .heading, #youtube-offline-video {
      text-align: center;
    }

    iframe {
      width: 75%;
      height: 75%;
    }

    #youtube-offline-video {
      video {
        height: 10em;
        width: 10em;
      }
    }

    .source {
      position: absolute;
      top: 1.4vmin;
      left: 8vmin;
    }
  }
</style>
