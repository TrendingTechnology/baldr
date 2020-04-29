<template>
  <div class="
    vc_instrument_master_preview
    slide-preview-fullscreen
  ">
    <img class="img-contain" :src="imageHttpUrl">
    <p class="important">{{ name }}</p>
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

<style lang="scss">
  .vc_instrument_master_preview {
    img {
      object-position: right bottom;
    }

    p {
      color: $orange;
      font-size: 2em;
      margin: 0;
      padding-left: 1em;
      position: absolute;
      top: 2em;
      width: 100%;
    }
  }
</style>
