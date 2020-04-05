<template>
  <div class="vc_audio_master">

    <p
      class="description"
      v-if="description"
      v-html="description"
    />

    <img
      :src="previewHttpUrl"
      class="preview"
      v-if="previewHttpUrl"
    />

    <p
      class="composer person"
      v-if="composer"
      v-html="composer"
    />

    <p
      class="title piece"
      v-if="title"
      v-html="title"
    />

    <p
      class="artist person"
      v-if="artist"
      v-html="artist"
    />

    <play-button :sample="sample"/>
    <external-sites :asset="mediaAsset"/>
  </div>
</template>

<script>
import ExternalSites from '@/components/ExternalSites.vue'

export default {
  props: {
    previewHttpUrl: {
      type: String
    },
    sample: {
      type: Object
    },
    mediaAsset: {
      type: Object
    },
    title: {
      type: String,
      required: true
    },
    composer: {
      type: String
    },
    artist: {
      type: String
    },
    description: {
      type: String
    }
  },
  components: {
    ExternalSites
  }
}
</script>

<style lang="scss">
  .vc_audio_master {
    text-align: center;
    font-size: 2em;

    p {
      margin: 0;
    }

    .composer {
      font-size: 1.2em;
    }

    .title {
      font-size: 1.1em;
    }

    .artist {
      margin-top: 5vw;
      font-size: 0.7em;
    }

    img.preview {
      height: 30vh;
      width: 30vh;
      object-fit: cover;
    }

    .description {
      font-size: 0.6em;
      padding-bottom: 2em;
    }

    .vc_play_button {
      position: fixed;
      bottom: 0.5em;
      left: 0.5em;
    }
  }
</style>
