<template>
  <div class="
    vc_group_master_preview
    slide-preview-fullscreen
  ">
    <img class="img-contain" :src="group.httpUrl">
    <div class="info-box">
      <p class="group important transparent-background">{{ group.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mainImage: {
      type: String,
      required: true
    }
  },
  computed: {
    group () {
      return this.$store.getters['media/mediaFileByUri'](this.mainImage)
    }
  }
}
</script>

<style lang="scss">
  .vc_group_master_preview {
    .info-box {
      bottom: 1em;
      position: absolute;
      right: 0;
      width: 100%;

      .group {
        font-size: 2em;
        margin: 0;
        padding-right: 1em;
        text-align: right;
      }
    }
  }
</style>
