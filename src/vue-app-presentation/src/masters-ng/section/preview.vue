<template>
  <div class="vc_section_master_preview">
    <div class="inner" v-html="heading"/>
  </div>
</template>

<script>
import { plainText } from '@bldr/core-browser'

export default {
  props: {
    heading: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_section_master_preview {
    display: flex;
    flex-direction: column;
    font-family: $font-family-sans-small-caps;
    font-size: 1.5em;
    font-weight: bold;
    height: 100%;
    justify-content: center;
    text-align: center;
    width: 100%;
  }
</style>
