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

<style lang="scss">
  .vc_slides_preview_play_button {
    .baldr-icon {
      background-color: $gray;
      font-size: 6em;
      left: 1.2em;
      opacity: 0.2;
      position: absolute;
      top: 0.6em;
    }
  }
</style>
