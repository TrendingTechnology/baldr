<template>
  <div class="
    vc_svg_master_preview
    slide-preview-fullscreen
    slide-preview-valign-center
  ">
    <img :src="svgHttpUrl"/>
  </div>
</template>

<script>
export default {
  props: {
    svgHttpUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_svg_master_preview {
    background-color: $white;
    padding: 1em;
  }
</style>
