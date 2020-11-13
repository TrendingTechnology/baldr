<template>
  <div class="vc_media_canvas" b-ui-theme="default">
    <material-icon name="close" @click.native="close"/>
    <div id="media-canvas-main"/>
  </div>
</template>

<script>

export default {
  name: 'MediaAsset',
  methods: {
    close () {
      this.$media.canvas.hide()
      this.$media.player.stop()
    }
  }
}
</script>

<style lang="scss">
  .vc_media_canvas {
    background-color: $black !important;
    display: none;
    height: 100vh;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 10;

    #media-canvas-main {
      width: 100%;
      height: 100%;
    }

    video, img {
      height: 100%;
      object-fit: contain;
      width: 100%;
    }

    img {
      background-color: $white;
    }

    .baldr-icon {
      background-color: $white;
      font-size: 3em;
      opacity: 0.2;
      position: absolute;
      right: 0.5em;
      top: 0.5em;
      z-index: 11;
    }
  }
</style>
