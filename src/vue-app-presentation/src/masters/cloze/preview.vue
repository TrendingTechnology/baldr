<template>
  <div class="vc_cloze_master_preview slide-preview-valign-top">
    <img :src="svgHttpUrl"/>
  </div>
</template>

<script>
export default {
  props: {
    svgHttpUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_cloze_master_preview {
    img {
      background-color: white;
    }
  }
</style>
