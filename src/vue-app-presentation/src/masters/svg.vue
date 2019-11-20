<template>
  <div class="vc_svg_master">
    <div ref="svgWrapper" id="svg-wrapper"/>
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

- title: Kurzform
  svg: id:Notenbeispiel_Freude-schoener-Goetterfunken

- title: Kurzform
  svg: id:Notenbeispiel_Freude-schoener-Goetterfunken_Anfang
`

export const master = {
  title: 'Bild',
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
      console.log(this.$refs.svgWrapper)
      this.$refs.svgWrapper.innerHTML = response.data
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
  }
</style>
