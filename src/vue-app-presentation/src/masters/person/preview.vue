<template>
  <div class="
    vc_person_master_preview
    slide-preview-fullscreen
  ">
    <img class="img-contain" :src="imageHttpUrl">
    <div class="info-box">
      <p class="person important transparent-background">{{ name }}</p>
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
    .info-box {
      bottom: 1em;
      position: absolute;
      right: 0;
      width: 100%;

      .person {
        font-size: 2em;
        margin: 0;
        padding-right: 1em;
        text-align: right;
      }
    }
  }
</style>
