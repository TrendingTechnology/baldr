<template>
  <div class="vc_section_master main-app-padding" v-html="heading"/>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
  .vc_section_master {
    font-family: $font-family-sans-small-caps;
    font-size: 5vw;
    font-weight: bold;
    text-align: center;
  }
</style>
