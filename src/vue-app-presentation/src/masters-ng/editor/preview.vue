<template>
  <div
    class="
      vc_editor_master_preview
      slide-preview-valign-top
      slide-preview-fix-typograph
      slide-preview-fullscreen
    "
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
    background-color:$handwriting-white;
    color: $handwriting-blue;
    font-family: $handwriting-font-family;

    h1, h2, h3, h4 {
      font-family: $handwriting-font-family !important;
    }
  }
</style>
