<template>
  <div class="vc_youtube_master_preview">
    <div class="info-box">
      <p class="heading font-shadow" v-if="heading" v-html="heading"/>
      <p class="info font-shadow" v-if="info" v-html="info"/>
    </div>
    <img :src="httpUrl" class="image-contain"/>
    <slide-preview-play-button/>
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
  },
  computed: {
    /**
     * https://stackoverflow.com/a/55890696/10193818
     *
     * Low quality
     * https://img.youtube.com/vi/[video-id]/sddefault.jpg
     *
     * medium quality
     * https://img.youtube.com/vi/[video-id]/mqdefault.jpg
     *
     * High quality
     * http://img.youtube.com/vi/[video-id]/hqdefault.jpg
     *
     * maximum resolution
     * http://img.youtube.com/vi/[video-id]/maxresdefault.jpg
     */
    httpUrl () {
      return `http://img.youtube.com/vi/${this.id}/hqdefault.jpg`
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_youtube_master_preview {
    font-size: 1.5em;

    .info-box {
      bottom: 0;
      box-sizing: border-box;
      padding: 0.2em;
      position: absolute;
      text-align: center;
      width: 100%;
    }

    .heading {
      font-weight: bold;
    }

    p {
      margin: 0;
    }
  }
</style>
