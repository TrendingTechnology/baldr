<template>
  <div class="vc_cloze_master">
    <div ref="clozeWrapper" id="cloze-wrapper"/>
    <!-- TODO: remove this tag. It is needed to trigger the `updated` hook -->
    <div class="hidden">{{ mediaFile.httpUrl }}</div>
  </div>
</template>

<script>
import { markupToHtml, displayElementByStepFull, displayElementByStepMinimal } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

const example = `
---
slides:

- title: Short form
  cloze: id:AB_Bachs-vergebliche-Reise
`

export const master = {
  title: 'Lückentext',
  icon: {
    name: 'cloze',
    color: 'blue'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { src: props }
    }
    return props
  },
  resolveMediaUris (props) {
    return [props.src]
  },
  enterStep ({ oldStepNo, newStepNo }) {
    const newClozeGroup = displayElementByStepMinimal(this.clozeGroups, oldStepNo, newStepNo)
    this.scroll(newClozeGroup)
  }
}

export default {
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei die den Lückentext enthält.',
      mediaFileUri: true
    }
  },
  data () {
    return {
      clozeGroups: []
    }
  },
  computed: {
    ...mapGetters(['slideCurrent']),
    mediaFile () {
      return this.$store.getters['media/mediaFileByUri'](this.src)
    }
  },
  methods: {
    async loadSvg () {
      let response = await this.$media.httpRequest.request({
        url: `/media/${this.mediaFile.path}`,
        method: 'get'
      })
      this.$refs.clozeWrapper.innerHTML = response.data
      this.clozeGroups = this.collectClozeGroups()
      this.slideCurrent.renderData.stepCount = this.clozeGroups.length + 1
      const newClozeGroup = displayElementByStepFull(this.clozeGroups, this.slideCurrent.renderData.stepNoCurrent)
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
      window.scrollTo({ top: adjustedY, left: 0, behavior: "smooth" });
    },
    collectClozeGroups () {
      const gElements = document.querySelectorAll('svg g')
      const clozeGElements = []
      for (const g of gElements) {
        if (g.style.fill === 'rgb(0, 0, 255)') {
          clozeGElements.push(g)
        }
      }
      return clozeGElements
    }
  },
  async mounted () {
    this.loadSvg()
  },
  async updated () {
    this.loadSvg()
  }
}
</script>

<style lang="scss" scoped>
  .vc_cloze_master {
    padding: 0;
    background-color: white;
  }
</style>

<style lang="scss">
  .vc_cloze_master {
    svg {
      width: 100vw;
      height: auto
    }
    .hidden {
      visibility: hidden;
      position: absolute;
    }
  }
</style>
