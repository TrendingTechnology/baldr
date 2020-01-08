<template>
  <div
    class="
      vc_slides_preview
      main-app-fullscreen
    "
    b-content-theme="default"
    :style="{ fontSize: previewSize + 'vw' }"
  >
    <display-controller/>
    <presentation-title/>
    <div v-if="slides">
      <grid-hierarchical
        v-if="previewLayoutCurrent.id === 'grid-hierarchical'"
        :slides="presentation.slidesTree"
      />
      <list-hierarchical
        v-if="previewLayoutCurrent.id === 'list-hierarchical'"
        :slides="presentation.slides"
      />
    </div>
    <open-interface v-else/>
  </div>
</template>

<script>
import PresentationTitle from '@/components/PresentationTitle'
import OpenInterface from '@/components/OpenInterface'
import GridHierarchical from './GridHierarchical.vue'
import DisplayController from './DisplayController.vue'
import ListHierarchical from './ListHierarchical.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'SlidesPreview',
  components: {
    OpenInterface,
    GridHierarchical,
    PresentationTitle,
    DisplayController,
    ListHierarchical
  },
  mounted: function () {
    this.$styleConfig.set({
      centerVertically: false,
      overflow: false
    })
    this.$shortcuts.addMultiple([
      {
        keys: '+',
        callback: this.increaseFontSize,
        description: 'Folien-Vorschauen vergrößern',
        routeNames: ['slides-preview']
      },
      {
        keys: '-',
        callback: this.decreaseFontSize,
        description: 'Folien-Vorschauen verkleiner',
        routeNames: ['slides-preview']
      }
    ])
  },
  destroyed: function () {
    this.$shortcuts.removeMultiple(['+', '-'])
  },
  computed: mapGetters([
    'presentation',
    'slideCurrent',
    'slides',
    'slidesCount',
    'previewSize',
    'previewLayoutCurrent'
  ]),
  methods: {
    increaseFontSize () {
      this.fontSize += 0.1
    },
    decreaseFontSize () {
      this.fontSize -= 0.1
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_slides_preview {
    padding: 1vw;

    h1 {
      font-size: 4vw;
    }
  }
</style>
