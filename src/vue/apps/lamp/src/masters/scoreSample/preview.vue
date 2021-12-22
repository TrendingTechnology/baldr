<template>
  <div
    class="
    vc_score_sample_master_preview
    slide-preview-fullscreen
  "
  >
    <img :src="scoreHttpUrl" />
    <slide-preview-play-button v-if="hasAudio" />
    <plain-icon
      class="transparent-background slide-preview-indicator-icon"
      v-if="isMultiPart"
      name="multi-part"
    />
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
    },
    isMultiPart: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
.vc_score_sample_master_preview {
  img {
    height: 90%;
    margin: 5%;
    object-fit: contain;
    width: 90%;
  }
}
</style>
