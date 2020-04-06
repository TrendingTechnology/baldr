<template>
  <div class="vc_svg_master">
    <div ref="svgWrapper" id="svg-wrapper" v-html="svgMarkup"/>
  </div>
</template>

<script>
import steps from '@/steps.js'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  props: {
    src: {
      type: String
    },
    svgPath: {
      type: String,
      required: true
    },
    svgTitle: {
      type: String,
      required: true
    },
    ...steps.mapProps(['selector', 'subset'])
  },
  data () {
    return {
      domSteps: null
    }
  },
  computed: {
    ...mapGetters(['slide']),
    svgMarkup () {
      return this.$store.getters['lampMasterSvg/svgByUri'](this.src)
    }
  }
}
</script>

<style lang="scss">
  .vc_svg_master {
    padding: 4vh 4vw;
    background-color: white;

    svg {
      bottom: 0;
      left: 0;
      object-fit: contain;
      width: 92vw;
      height: 90vh;
    }

  }
</style>

<style lang="scss">
  .vc_svg_master {
    svg {
      bottom: 0;
      left: 0;
      object-fit: contain;
      width: 92vw;
      height: 90vh;
    }
  }
</style>
