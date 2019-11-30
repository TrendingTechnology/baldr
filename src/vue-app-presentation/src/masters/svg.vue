<template>
  <div class="vc_svg_master">
    <div ref="svgWrapper" id="svg-wrapper"/>
    <!-- TODO: remove needed to get updated hook -->
    <div class="hidden">{{ mediaFile.httpUrl }}</div>
  </div>
</template>

<script>
import { markupToHtml } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

const example = `
---
slides:

- title: Kurzform
  svg: id:Notenbeispiel_Freude-schoener-Goetterfunken

- title: Kurzform
  svg: id:Notenbeispiel_Freude-schoener-Goetterfunken_Anfang
`

function setGroupDisplayByStepNo (stepNo) {
  const elGroups = document.querySelectorAll('.baldr-group')
  let count = 1
  for (const elGroup of elGroups) {
    if (stepNo > count) {
      elGroup.style.display = 'block'
    } else {
      elGroup.style.display = 'none'
    }
    count += 1
  }
}

export const master = {
  title: 'Bild',
  icon: {
    name: 'image',
    color: 'blue',
    showOnSlides: false
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
  enterStep ({ newStepNo }) {
    setGroupDisplayByStepNo(newStepNo)
  }
}

export default {
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei.',
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
      this.$refs.svgWrapper.innerHTML = response.data
      const elGroups = document.querySelectorAll('.baldr-group')
      this.slideCurrent.renderData.stepCount = elGroups.length + 1
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
  .vc_svg_master {
    padding: 4vh 4vw;
    background-color: white;

    svg {
      bottom: 0;
      left: 0;
      object-fit: contain;
      width: 92vw;
      height: 90vh;
    }

  }
</style>

<style lang="scss">
  .vc_svg_master {
    svg {
      bottom: 0;
      left: 0;
      object-fit: contain;
      width: 92vw;
      height: 90vh;
    }

    .hidden {
      visibility: hidden;
      position: absolute;
    }
  }
</style>
