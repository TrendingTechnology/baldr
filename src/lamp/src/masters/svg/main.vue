<template>
  <div class="vc_svg_master">
    <div ref="svgWrapper" id="svg-wrapper"/>
  </div>
</template>

<script>
import { DomSteps } from '@/lib.js'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  props: {
    svgPath: {
      type: String,
      required: true
    },
    svgTitle: {
      type: String,
      required: true
    },
    ...DomSteps.mapProps(['selector', 'subset'])
  },
  data () {
    return {
      domSteps: null
    }
  },
  computed: mapGetters(['slide'])
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
