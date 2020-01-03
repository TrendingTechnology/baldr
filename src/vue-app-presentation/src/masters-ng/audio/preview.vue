<template>
  <div class="vc_audio_master_preview slide-preview-wrapper">
    <img
      :src="previewHttpUrl"
      class="image-contain"
      v-if="previewHttpUrl"
    />
    <div class="metadata">
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
    </div>
    <slide-preview-play-button/>
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_audio_master_preview {
    p {
      margin: 0;
    }

    .metadata {
      position: absolute;
      bottom: 0
    }
    .composer {
      font-size: 1.2em;
    }

    .title {
      font-size: 1.1em;
    }


  }
</style>
