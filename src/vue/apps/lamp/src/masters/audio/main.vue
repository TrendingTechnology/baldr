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
      v-if="partOf"
      v-html="partOf"
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

    <wave-form :asset="mediaAsset"/>

    <play-button class="left-bottom-corner" :sample="sample"/>
    <external-sites :asset="mediaAsset"/>
  </div>
</template>

<script>
import ExternalSites from '@/components/ExternalSites.vue'
import WaveForm from './WaveForm.vue'

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
    partOf: {
      type: String
    },
    description: {
      type: String
    }
  },
  components: {
    ExternalSites,
    WaveForm
  }
}
</script>

<style lang="scss">
  .vc_audio_master {
    text-align: center;

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
      margin-top: 4em;
      font-size: 0.7em;
    }

    img.preview {
      height: 10em;
      width: 10em;
      object-fit: cover;
    }

    .description {
      font-size: 0.6em;
      padding-bottom: 2em;
    }
  }
</style>
