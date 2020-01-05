<template>
  <div
    class="vc_generic_master"
    v-html="markupCurrent"
  />
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

const CHARACTERS_ON_SLIDE = 400

export default {
  props: {
    markup: {
      type: [String, Array],
      required: true,
      // It is complicated to convert to prop based markup conversion.
      //markup: true
      description:  'Markup im HTML oder Markdown-Format'
    },
    charactersOnSlide: {
      type: [Number],
      description: 'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
      default: CHARACTERS_ON_SLIDE
    },
    stepWords: {
      type: [Boolean],
      description: 'Wörtern einblenden',
      default: false
    }
  },
  data () {
    return {
      steps: null
    }
  },
  computed: {
    ...mapGetters(['slideCurrent']),
    stepNoCurrent () {
      return this.slideCurrent.renderData.stepNoCurrent
    },
    markupCurrent () {
      if (this.stepWords) {
        return this.markup[0]
      }
      return this.markup[this.stepNoCurrent - 1]
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_generic_master {
    font-size: 3vw;
    padding: 2vw 10vw;
  }
</style>
