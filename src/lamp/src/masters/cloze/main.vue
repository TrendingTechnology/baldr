<template>
  <div class="vc_cloze_master">
    <div ref="clozeWrapper" id="cloze-wrapper"/>
  </div>
</template>

<script>
import { DomSteps, warnSvgWidthHeight } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  props: {
    svgPath: {
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
  computed: mapGetters(['slideCurrent']),
  methods: {
    collectClozeGroups () {
      const gElements = document.querySelectorAll('svg g')
      const clozeGElements = []
      for (const g of gElements) {
        if (g.style.fill === 'rgb(0, 0, 255)') {
          clozeGElements.push(g)
        }
      }
      return clozeGElements
    },
    async loadSvg () {
      let response = await this.$media.httpRequest.request({
        url: `/media/${this.svgPath}`,
        method: 'get'
      })
      this.$refs.clozeWrapper.innerHTML = response.data
      warnSvgWidthHeight()
      this.domSteps = new DomSteps({
        elements: this.collectClozeGroups(),
        subsetSelectors: this.slideCurrent.props.stepSubset
      })
      this.domSteps.setStepCount(this.slideCurrent)

      const newClozeGroup = this.domSteps.displayByNo({
        stepNo: this.slideCurrent.stepNo
      })
      this.scroll(newClozeGroup)
    },
    /**
     *
     */
    scroll(newClozeGroup) {
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
      window.scrollTo({ top: adjustedY, left: 0, behavior: 'smooth' });
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
