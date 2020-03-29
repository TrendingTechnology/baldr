<template>
  <div
    class="
      vc_generic_master_preview
      slide-preview-valign-top
      slide-preview-fix-typography
      slide-preview-fullscreen
    "
    v-html="markup"
  />
</template>

<script>
export default {
  props: {
    markup: {
      type: String,
      required: true,
    }
  }
}
</script>
