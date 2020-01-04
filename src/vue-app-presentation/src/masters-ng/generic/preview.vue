<template>
  <div
    class="vc_generic_master_preview"
    v-html="markupCurrent"
  />
</template>

<script>
import { plainText } from '@bldr/core-browser'
import { markupToHtml, wrapWords, displayElementByStepNo } from '@/lib.js'
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
  }
}
</script>

<style lang="scss" scoped>
  .vc_generic_master_preview {
    font-size: 3vw;
    padding: 2vw 10vw;
  }
</style>
