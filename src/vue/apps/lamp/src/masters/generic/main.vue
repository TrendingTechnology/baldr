<template>
  <div class="vc_generic_master">
    <span
      ref="contentWrapper"
      class="content-wrapper"
      v-html="markupCurrent"
    />
  </div>
</template>

<script>
import { mapStepFieldDefintions } from '@bldr/presentation-parser'
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
    ...mapStepFieldDefintions(['mode', 'subset'])
  },
  data () {
    return {
      steps: null,
      domSteps: null
    }
  },
  computed: {
    ...mapGetters(['slide']),
    markupCurrent () {
      if (this.stepMode) {
        return this.markup[0]
      }
      if (this.navNos.stepNo) {
        return this.markup[this.navNos.stepNo - 1]
      }
      return this.markup[0]
    }
  }
}
</script>

<style lang="scss">
  .vc_generic_master {
    padding: 0.5em 2em;
  }
</style>
