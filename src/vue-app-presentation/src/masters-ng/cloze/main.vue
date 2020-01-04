<template>
  <div class="vc_cloze_master">
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
  },
  data () {
    return {
      allClozeGroups: null,
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
      this.allClozeGroups = this.collectClozeGroups()
      this.clozeGroups = this.selectClozeGroups(this.allClozeGroups)
      this.slideCurrent.renderData.stepCount = this.clozeGroups.length + 1
      for (const group of this.allClozeGroups) {
        group.style.display = 'none'
      }
      const newClozeGroup = displayElementByStepNo({
        elements: this.clozeGroups,
        stepNo: this.slideCurrent.renderData.stepNoCurrent
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
    },
    selectClozeGroups (clozeGroups) {
      let begin = 0
      if (this.stepBegin && this.stepBegin > 1) {
        begin = this.stepBegin - 2
      }
      let end = clozeGroups.length - 1
      if (this.stepEnd && this.stepEnd > 1) {
        end = this.stepEnd - 2
      }
      return clozeGroups.splice(begin, end - begin + 1)
    }
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
  }
</style>
