<template>
  <div class="
    vc_person_master_preview
    slide-preview-fullscreen
  ">
    <img :src="imageHttpUrl">
    <div class="info-box">
      <p class="person important">{{ name }}</p>
    </div>
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
  .vc_person_master_preview {
    img {
      height: 100%;
      width: 100%;
      left: 0;
      object-fit: contain;
      object-position: left bottom;
    }

    .info-box {
      bottom: 1em;
      position: absolute;
      right: 0;
      width: 100%;

      .person {
        background: rgba(170, 170, 170, 0.3);
        font-size: 2em;
        margin: 0;
        padding-right: 1em;
        text-align: right;
      }
    }
  }
</style>
