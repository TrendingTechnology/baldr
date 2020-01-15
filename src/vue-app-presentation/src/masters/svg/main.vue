<template>
  <div class="vc_svg_master">
    <div ref="svgWrapper" id="svg-wrapper"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

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
    stepSelector: {
      default: 'g[inkscape\\:groupmode="layer"]'
    },
    stepExclude: {
      type: [Array, Number]
    }
  },
  data () {
    return {
      elGroups: null
    }
  },
  computed: mapGetters(['slideCurrent'])
}
</script>

<style lang="scss" scoped>
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
