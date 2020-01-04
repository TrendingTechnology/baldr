<template>
  <div class="vc_cloze_master_preview">
    <div ref="clozeWrapper" id="cloze-wrapper"/>
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
      description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
      mediaFileUri: true
    },
    stepBegin: {
      type: Number,
      description: 'Beginne bei dieser Schrittnumber Lückentextwörter einzublenden.'
    },
    stepEnd: {
      type: Number,
      description: 'Höre bei dieser Schrittnumber auf Lückentextwörter einzublenden.'
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_cloze_master_preview {
  }
</style>
