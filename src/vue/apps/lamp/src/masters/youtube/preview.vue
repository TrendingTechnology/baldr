<template>
  <div class="
    slide-preview-fullscreen
    slide-preview-valign-center
    vc_youtube_master_preview
  ">
    <div class="meta-box">
      <p class="heading font-shadow" v-if="heading" v-html="heading"/>
      <p class="info font-shadow" v-if="info" v-html="info"/>
    </div>
    <img :src="httpUrl" class="image-contain"/>
    <slide-preview-play-button/>
    <plain-icon
      class="slide-preview-indicator-icon"
      v-if="asset"
      name="cloud-download"
    />
  </div>
</template>

<script>
import { findPreviewHttpUrl } from './main.js'
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
  },
  computed: {
    httpUrl () {
      return findPreviewHttpUrl(this.youtubeId, this.asset)
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_youtube_master_preview {
    font-size: 1.5em;

    .meta-box {
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
