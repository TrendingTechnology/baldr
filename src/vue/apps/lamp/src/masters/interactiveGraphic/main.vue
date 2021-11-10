<template>
  <div class="vc_interactive_graphic_master">
    <div ref="svgWrapper" id="svg-wrapper" v-html="svgMarkup"/>
  </div>
</template>

<script>
import { mapStepFieldDefintions } from '@bldr/presentation-parser'
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
    ...mapStepFieldDefintions(['selector', 'subset'])
  },
  data () {
    return {
      domSteps: null
    }
  },
  computed: {
    ...mapGetters(['slide']),
    svgMarkup () {
      return this.$store.getters['lamp/masters/interactiveGraphic/svgByUri'](this.src)
    }
  }
}
</script>

<style lang="scss">
  .vc_interactive_graphic_master {
    padding: 3em 3em;
    background-color: white;

    svg {
      bottom: 0;
      height: 90%;
      left: 0;
      object-fit: contain;
      width: 92%;
    }
  }
</style>
