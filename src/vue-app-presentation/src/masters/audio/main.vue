<template>
  <div class="vc_audio_master">
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
  .vc_audio_master {
    text-align: center;
    font-size: 3vw;

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
  }
</style>
