<template>
  <div class="vc_svg_master">
    <div ref="svgWrapper" id="svg-wrapper"/>
  </div>
</template>

<script>
import { markupToHtml, displayElementByStepNo } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

const example = `
---
slides:

- title: Shortcuts
  svg:
    src: id:Requiem_NB_Confutatis_1-Takt
    step_exclude: 1

- title: Kurzform
  svg: id:Notenbeispiel_Freude-schoener-Goetterfunken

- title: Langform
  svg:
    src: id:Notenbeispiel_Freude-schoener-Goetterfunken_Anfang

- title: g Element
  svg:
    src: id:NB_Dreiklaenge-Nationalhymnen_F-Dur
    step_exclude: 1

- title: class
  svg:
    src: id:Moses_Notationsweisen
    step_selector: .baldr-group
`

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
    if ('stepExclude' in props && typeof props.stepExclude === 'number') {
      props.stepExclude = [props.stepExclude]
    }
    return props
  },
  resolveMediaUris (props) {
    return [props.src]
  },
  async enterSlide () {
    let response = await this.$media.httpRequest.request({
      url: `/media/${this.mediaFile.path}`,
      method: 'get'
    })
    const svg = this.$refs.svgWrapper
    svg.innerHTML = response.data
    this.elGroups = svg.querySelectorAll(this.stepSelector)
    this.elGroups = this.removeElementsFromSteps(this.elGroups, this.stepExclude)
    this.slideCurrent.renderData.stepCount = this.elGroups.length + 1
    displayElementByStepNo({
      elements: this.elGroups,
      stepNo: this.slideCurrent.renderData.stepNoCurrent
    })
    this.shortcutsRegister(this.elGroups)
  },
  leaveSlide () {
    if ('shortcutsUnregister' in this) this.shortcutsUnregister(this.elGroups)
  },
  enterStep ({ oldStepNo, newStepNo }) {
    displayElementByStepNo({
      elements: this.elGroups,
      oldStepNo,
      stepNo: newStepNo
    })
  }
}

export default {
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer SVG-Datei.',
      mediaFileUri: true
    },
    stepSelector: {
      default: 'g',
      description: 'Selektor, der Elemente auswählt, die als Schritte eingeblendet werden sollen.'
    },
    stepExclude: {
      type: [Array, Number],
      description: 'Schritt-Number der Elemente, die nicht als Schritte eingeblendet werden sollen. (z. B. 1, oder [1, 2, 3])'
    }
  },
  computed: {
    ...mapGetters(['slideCurrent']),
    mediaFile () {
      return this.$store.getters['media/mediaFileByUri'](this.src)
    }
  },
  data () {
    return {
      elGroups: null
    }
  },
  methods: {
    /**
     * Remove some element from the step nodelist. The node list is
     * converted into a array.
     *
     * @param {Array} exclude - An array of element numbers to exclude
     *   that means delete from the elements array.
     *
     * @returns {Array}
     */
    removeElementsFromSteps (elements, exclude) {
      if (!exclude) return elements
      // Sort exclude numbers descending
      elements = [...elements]
      exclude.sort((a, b) => { b - a })
      for (const stepNo of exclude) {
        elements.splice(stepNo - 1, 1)
      }
      return elements
    },
    shortcutsRegister (elements) {
      for (const element of elements) {
        const shortcut = element.getAttribute('baldr-shortcut')
        const description = element.getAttribute('inkscape:label')
        this.$shortcuts.add(`q ${shortcut}`, () => {
          element.style.display = 'block'
        }, `${description} (einblenden in SVG: „${this.mediaFile.title}“)`)
      }
    },
    shortcutsUnregister (elements) {
      for (const element of elements) {
        const shortcut = element.getAttribute('baldr-shortcut')
        this.$shortcuts.remove(`q ${shortcut}`)
      }
    }
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
