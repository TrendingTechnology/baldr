<template>
  <div
    class="vc_editor_master_preview"
    spellcheck="false"
    v-html="markupSafe"
    :style="{ fontSize: fontSize + 'vw' }">
  </div>
</template>

<script>
import { plainText } from '@bldr/core-browser'
import { markupToHtml, wrapWords, displayElementByStepNo } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

const placeholder = '…'
const placeholderTag = `<span class="editor-placeholder">${placeholder}</span>`
const defaultMarkup = `<p contenteditable>${placeholderTag}</p>`

export default {
  props: {
    markup: {
      type: String,
      markup: true,
      description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
    },
    stepWords: {
      type: Boolean,
      description: 'Wörtern einblenden',
      default: false
    }
  }
}
</script>

<style lang="scss">
  .vc_editor_master_preview {
  }
</style>
