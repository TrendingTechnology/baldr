<template>
  <div class="
    vc_section_master_preview
    slide-preview-fullscreen
    slide-preview-valign-center
  ">
    <div class="inner" v-html="heading"/>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_section_master_preview {
    font-family: $font-family-sans-small-caps;
    font-size: 1.5em;
    font-weight: bold;
  }
</style>
