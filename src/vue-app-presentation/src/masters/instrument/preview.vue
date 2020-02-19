<template>
  <div class="
    vc_instrument_master_preview
    slide-preview-fullscreen
  ">
    <img :src="imageHttpUrl">
    <p class="transparent-background important">{{ name }}</p>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    imageHttpUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_instrument_master_preview {
    img {
      height: 100%;
      width: 100%;
      right: 0;
      object-fit: contain;
      object-position: right bottom;
    }

    p {
      position: absolute;
      top: 2em;
      width: 100%;
      color: $black;
      font-size: 2em;
      margin: 0;
      padding-left: 1em;
    }
  }
</style>
