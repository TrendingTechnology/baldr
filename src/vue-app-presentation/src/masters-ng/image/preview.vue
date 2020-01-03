<template>
  <div class="vc_image_master_preview">
    <img :src="imageHttpUrl"/>
  </div>
</template>

<script>
export default {
  props: {
    imageHttpUrl: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_image_master_preview {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
</style>
