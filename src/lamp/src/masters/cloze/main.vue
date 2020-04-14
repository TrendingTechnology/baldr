<template>
  <div class="vc_cloze_master">
    <div ref="clozeWrapper" id="cloze-wrapper" v-html="svgMarkup"/>
  </div>
</template>

<script>
import steps from '@/steps.js'

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    ...steps.mapProps(['subset'])
  },
  data () {
    return {
      domSteps: null
    }
  },
  computed: {
    svgMarkup () {
      return this.$store.getters['lampMasterCloze/svgByUri'](this.src)
    }
  }
}
</script>

<style lang="scss">
  .vc_cloze_master {
    padding: 0;
    background-color: white;

    svg {
      width: 100%;
      height: auto
    }
  }
</style>
