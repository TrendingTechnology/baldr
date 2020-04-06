<template>
  <div class="vc_cloze_master">
    <div ref="clozeWrapper" id="cloze-wrapper" v-html="svgMarkup"/>
  </div>
</template>

<script>
import { warnSvgWidthHeight } from '@/lib.js'
import { DomSteps } from '@/steps.js'
import { createNamespacedHelpers } from 'vuex'
import { collectClozeGroups, scrollToClozeGroup } from './main.js'
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
  mounted () {
    warnSvgWidthHeight()
    this.domSteps = new DomSteps({
      elements: collectClozeGroups(document),
      subsetSelectors: this.slide.props.stepSubset
    })

    const newClozeGroup = this.domSteps.displayByNo({
      stepNo: this.slide.stepNo
    })
    scrollToClozeGroup(newClozeGroup)
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
