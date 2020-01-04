<template>
  <div class="vc_svg_master_preview">
    <div ref="svgWrapper" id="svg-wrapper"/>
  </div>
</template>

<script>
import { markupToHtml, displayElementByStepNo } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei.',
      mediaFileUri: true
    },
    stepSelector: {
      default: 'g',
      description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen.'
    },
    stepExclude: {
      type: [Array, Number],
      description: 'Schritt-Number der Elemente, die nicht als Schritte eingeblendet werden sollen. (z. B. 1, oder [1, 2, 3])'
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_svg_master_preview {
  }
</style>
