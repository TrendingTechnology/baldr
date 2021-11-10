<template>
  <div class="vc_cloze_master">
    <div ref="clozeWrapper" id="cloze-wrapper" v-html="svgMarkup"/>
  </div>
</template>

<script>
import { mapStepFieldDefintions } from '@bldr/presentation-parser'

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    ...mapStepFieldDefintions(['subset'])
  },
  data () {
    return {
      domSteps: null
    }
  },
  computed: {
    svgMarkup () {
      return this.$store.getters['lamp/masters/cloze/svgByUri'](this.src)
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
