<template>
  <div class="
    vc_counter_master_preview
    slide-preview-valign-center
    slide-preview-fullscreen
    sans
  ">
    <div class="inner">{{ to }}</div>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss">
  .vc_counter_master_preview {
    font-size: 10em;
  }
</style>
