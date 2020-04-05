<template>
  <div class="
    vc_wikipedia_master_preview
    slide-preview-valign-center
    slide-preview-fullscreen
  ">
    <img v-if="thumbnailUrl" :src="thumbnailUrl" class="image-contain"/>

    <div class="text-overlay transparent-background">
      <p class="title">{{ titleNoUnderscores }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    titleNoUnderscores () {
      return this.title.replace(/_/g, ' ')
    },
    thumbnailUrl () {
      return this.$store.getters['lampMasterWikipedia/thumbnailUrlById'](this.id)
    }
  }
}
</script>

<style lang="scss">
  .vc_wikipedia_master_preview {
    background-color: scale-color($gray, $lightness: 30%) !important;
    color: $black !important;
    font-size: 3em;

    .text-overlay {
      bottom: 0;
      left: 0;
      line-height: 1em;
      position: absolute;
      text-align: center;
      text-shadow: 0 0 0.1em $white;
      width: 100%;
    }
  }
</style>
