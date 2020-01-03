<template>
  <div class="vc_slides_preview_play_button">
    <plain-icon name="play"/>
  </div>
</template>

<script>
export default {
  name: 'SlidePreviewPlayButton'
}
</script>

<style lang="scss" scoped>
  .vc_slides_preview_play_button {
    .baldr-icon {
      position: absolute;
      left: 1.2em;
      top: 0.6em;
      font-size: 6em;
      opacity: 0.5;
    }
  }
</style>
