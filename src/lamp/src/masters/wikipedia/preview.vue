<template>
  <div class="
    vc_wikipedia_master_preview
    slide-preview-valign-center
    slide-preview-fullscreen
  ">
    <img v-if="thumbnailUrl" :src="thumbnailUrl" class="image-contain"/>
    <img v-else src="./wikipedia.png" class="image-contain"/>

    <div class="text-overlay">
      {{ titleNoUnderscores }}
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
      return this.$store.getters['lamp/masters/wikipedia/thumbnailUrlById'](this.id)
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
      background-color: rgba($white, 0.8);
      bottom: 0;
      left: 0;
      overflow: hidden;
      padding: 0 0 0.2em 0.2em;
      position: absolute;
      text-align: left;
      text-decoration: underline;
      text-overflow: ellipsis;
      text-shadow: 0 0 0.1em $white;
      white-space: nowrap;
      width: 100%;
    }
  }
</style>
