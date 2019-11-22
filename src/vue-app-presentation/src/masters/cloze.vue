<template>
  <div class="vc_cloze_master">
    <div ref="clozeWrapper" id="cloze-wrapper"/>
    {{ mediaFile.httpUrl }}
  </div>
</template>

<script>
import { markupToHtml } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

const example = `
---
slides:

- title: inkscape
  cloze: id:inkscape

- title: inkscape
  cloze: id:pdf2svg
`

function collectClozeGroups () {
  const gElements = document.querySelectorAll('svg g')
  const clozeGElements = []
  for (const g of gElements) {
    if (g.style.fill === 'rgb(0, 0, 255)') {
      clozeGElements.push(g)
    }
  }
  return clozeGElements
}

function setGroupDisplayByStepNo (stepNo) {
  const clozeGroups = collectClozeGroups()
  let count = 1
  for (const group of clozeGroups) {
    if (stepNo > count) {
      group.style.display = 'block'
    } else {
      group.style.display = 'none'
    }
    count += 1
  }
}

export const master = {
  title: 'Lückentext',
  icon: 'image',
  color: 'blue',
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
  enterStep ({ newStepNo }) {
    setGroupDisplayByStepNo(newStepNo)
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

      const clozeGroups = collectClozeGroups()
      this.slideCurrent.renderData.stepCount = clozeGroups.length + 1
      setGroupDisplayByStepNo(this.slideCurrent.renderData.stepNoCurrent)
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
      width: 100% !important;
    }
  }
</style>
