<template>
  <div class="
    vc_score_sample_master_preview
    slide-preview-fullscreen
  ">
    <img :src="scoreHttpUrl"/>
    <slide-preview-play-button v-if="hasAudio"/>
  </div>
</template>

<script>
export default {
  props: {
    scoreHttpUrl: {
      type: String,
      required: true
    },
    hasAudio: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
  .vc_score_sample_master_preview {
    background-color: $white !important;

    img {
      width: 90%;
      height: 90%;
      object-fit: contain;
      margin: 5%;
    }
  }
</style>
