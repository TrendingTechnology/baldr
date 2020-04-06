<template>
  <div
    class="vc_generic_master"
    v-html="markupCurrent"
  />
</template>

<script>
import steps from '@/steps.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

const CHARACTERS_ON_SLIDE = 400

export default {
  props: {
    markup: {
      type: [String, Array],
      required: true,
      // It is complicated to convert to prop based markup conversion.
      // markup: true
      description: 'Markup im HTML oder Markdown-Format'
    },
    charactersOnSlide: {
      type: [Number],
      description: 'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
      default: CHARACTERS_ON_SLIDE
    },
    ...steps.mapProps(['mode', 'subset'])
  },
  data () {
    return {
      steps: null,
      domSteps: null
    }
  },
  computed: {
    ...mapGetters(['slide']),
    stepNo () {
      return this.slide.stepNo
    },
    markupCurrent () {
      if (this.stepMode) {
        return this.markup[0]
      }
      return this.markup[this.stepNo - 1]
    }
  }
}
</script>

<style lang="scss">
  .vc_generic_master {
    font-size: 3vw;
    padding: 2vw 10vw;
  }
</style>
