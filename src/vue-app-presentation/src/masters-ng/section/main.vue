<template>
  <div class="vc_section_master default-padding" v-html="heading"/>
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
  .vc_section_master {
    font-family: $font-family-sans-small-caps;
    font-size: 5vw;
    font-weight: bold;
    text-align: center;
  }
</style>
