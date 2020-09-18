<template>
  <div class="
    vc_sample_list_master_preview
    slide-preview-fullscreen
  ">
  </div>
</template>

<script>
export default {
  props: {
    previewHttpUrl: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    composer: {
      type: String
    }
  }
}
</script>

<style lang="scss">
  .vc_sample_list_master_preview {
  }
</style>
