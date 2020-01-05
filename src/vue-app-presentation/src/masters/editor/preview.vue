<template>
  <div
    class="
      vc_editor_master_preview
      slide-preview-valign-top
      slide-preview-fix-typograph
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
