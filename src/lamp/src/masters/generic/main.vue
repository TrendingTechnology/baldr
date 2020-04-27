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
import steps from '@/steps.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')


function adjustSlideSize (rootElement, rootContentRect, wrapperElement) {
  const rootWidth = rootContentRect.width
  const rootHeight = rootContentRect.height

  const wrapperRect = wrapperElement.getBoundingClientRect()
  const wrapperWidth = wrapperRect.width
  const wrapperHeight = wrapperRect.height
}

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
    markupCurrent () {
      if (this.stepMode) {
        return this.markup[0]
      }
      if (this.navNos.stepNo) {
        return this.markup[this.navNos.stepNo - 1]
      }
      return this.markup[0]
    }
  },
  mounted () {
    const ro = new ResizeObserver(entries => {
      console.log(entries)
      // const entry = entries[0]
      // console.log(entry)
      // adjustSlideSize(this.$el, entry.contentRect, this.$refs.contentWrapper)
    })
    ro.observe(this.$el)
    console.log(this.$refs.contentWrapper)
    ro.observe(this.$refs.contentWrapper)
  }
}
</script>

<style lang="scss">
  .vc_generic_master {
    padding: 0.5em 2em;
  }
</style>
