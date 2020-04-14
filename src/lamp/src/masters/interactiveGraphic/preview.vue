<template>
  <div class="
    vc_interactive_graphic_master_preview
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

<style lang="scss">
  .vc_interactive_graphic_master_preview {
    padding: 1em;
  }
</style>
