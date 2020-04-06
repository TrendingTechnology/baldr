<template>
  <div class="vc_cloze_master">
    <div ref="clozeWrapper" id="cloze-wrapper" v-html="svgMarkup"/>
  </div>
</template>

<script>
import { warnSvgWidthHeight } from '@/lib.js'
import { DomSteps } from '@/steps.js'
import { createNamespacedHelpers } from 'vuex'
import { collectClozeGroups } from './main.js'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    ...DomSteps.mapProps(['subset'])
  },
  data () {
    return {
      domSteps: null
    }
  },
  computed: {
    ...mapGetters(['slide']),
    svgMarkup () {
      return this.$store.getters['lampMasterCloze/svgByUri'](this.src)
    }
  },
  methods: {
    async loadSvg () {
      if (!this.$refs.clozeWrapper) return

      warnSvgWidthHeight()
      this.domSteps = new DomSteps({
        elements: collectClozeGroups(document),
        subsetSelectors: this.slide.props.stepSubset
      })

      const newClozeGroup = this.domSteps.displayByNo({
        stepNo: this.slide.stepNo
      })
      this.scroll(newClozeGroup)
    },
    /**
     *
     */
    scroll (newClozeGroup) {
      // e. g.: 1892
      // svg.clientHeight
      const svg = document.querySelector('svg')
      // e. g.: 794.4473876953125
      // bBox.height
      const bBox = svg.getBBox()
      const glyph = newClozeGroup.children[0]
      // e. g.: 125.11000061035156
      const y = svg.clientHeight / bBox.height * glyph.y.baseVal.value
      const adjustedY = y - 0.8 * window.screen.height
      window.scrollTo({ top: adjustedY, left: 0, behavior: 'smooth' })
    }
  },
  mounted () {
    this.loadSvg()
  }
}
</script>

<style lang="scss">
  .vc_cloze_master {
    padding: 0;
    background-color: white;

    svg {
      width: 100vw;
      height: auto
    }
  }
</style>
