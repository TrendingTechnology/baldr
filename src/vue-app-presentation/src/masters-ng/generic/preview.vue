<template>
  <div
    class="vc_generic_master_preview"
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

<style lang="scss" scoped>
  .vc_generic_master_preview {
    background-color: $white;
    color: $black;
    display: flex;
    flex-flow: column;
    overflow: hidden;
    padding: 1em;
    text-align: left;
  }
</style>

<style lang="scss">
  .vc_generic_master_preview {

    h1 {
      font-size: 1.2em;
    }

    h2 {
      font-size: 1.1em;
    }

    h3, h4, h5 {
      font-size: 1em;
    }
  }
</style>
