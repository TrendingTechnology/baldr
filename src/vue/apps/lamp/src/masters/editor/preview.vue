<template>
  <div
    class="
      vc_editor_master_preview
      slide-preview-valign-top
      slide-preview-fix-typography
      slide-preview-fullscreen
    "
    b-content-theme="handwriting"
    b-content-theme-unchangeable
    spellcheck="false"
    v-html="markup">
  </div>
</template>

<script>
export default {
  props: {
    markup: {
      type: String
    }
  }
}
</script>

<style lang="scss">
  .vc_editor_master_preview {
    ul li {
      text-indent: 0 !important;

      &::before {
        margin-left: 0 !important;
      }
    }
  }
</style>
