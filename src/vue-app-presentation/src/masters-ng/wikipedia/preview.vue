<template>
  <div class="
    vc_wikipedia_master_preview
    slide-preview-valign-center
    slide-preview-fullscreen
  ">
    <p class="title">
      Wikipedia-Artikel: <br/>
      {{ title }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_wikipedia_master_preview {
    background-color: scale-color($gray, $lightness: 30%) !important;
    color: $black !important;
    font-size: 1.7em;
  }
</style>
