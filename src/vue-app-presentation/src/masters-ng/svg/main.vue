<template>
  <div class="vc_svg_master">
    <div ref="svgWrapper" id="svg-wrapper"/>
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
