<template>
  <div class="vc_media_canvas" b-ui-theme="default">

  </div>
</template>

<script>

export default {
  name: 'MediaCanvas',
}
</script>

<style lang="scss">
  .vc_media_canvas {
    height: 100vh;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
    display: none;

    video {
      height: 100%;
      object-fit: contain;
      width: 100%;
    }
  }
</style>
