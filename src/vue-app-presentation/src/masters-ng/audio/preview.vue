<template>
  <div class="vc_audio_master_preview slide-preview-wrapper">
    <div class="inner">
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
    </div>
  </div>
</template>

<script>
export default {
  props: {
    previewHttpUrl: {
      type: String
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_audio_master_preview {
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
      margin-top: 1em;
      font-size: 0.7em;
    }

    img.preview {
      height: 1em;
      width: 1em;
      object-fit: cover;
    }
  }
</style>
