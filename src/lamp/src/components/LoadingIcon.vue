<template>
  <div class="vc_loading_icon valign-wrapper main-app-fullscreen">
    <div class="valign-center">
      <plain-icon
        name="loading"
        class="baldr-icon-spin"
      />
      <p class="caption">laden ...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingIcon'
}
</script>

<style lang="scss">
  .vc_loading_icon {
    font-size: 20em;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;

    .caption {
      font-family: $font-family-sans;
      font-size: 0.4em;
    }
  }
</style>
