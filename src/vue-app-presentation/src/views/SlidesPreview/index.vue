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
import DisplayController from './DisplayController.vue'
import GridHierarchical from './GridHierarchical.vue'
import ListHierarchical from './ListHierarchical.vue'
import OpenInterface from '@/components/OpenInterface'
import PresentationTitle from '@/components/PresentationTitle'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'SlidesPreview',
  components: {
    DisplayController,
    GridHierarchical,
    ListHierarchical,
    OpenInterface,
    PresentationTitle
  },
  mounted: function () {
    this.$styleConfig.set({
      centerVertically: false,
      overflow: false
    })
    this.$shortcuts.addMultiple([
      {
        keys: '+',
        callback: this.increasePreviewSize,
        description: 'Folien-Vorschauen vergrößern',
        routeNames: ['slides-preview']
      },
      {
        keys: '-',
        callback: this.decreasePreviewSize,
        description: 'Folien-Vorschauen verkleiner',
        routeNames: ['slides-preview']
      }
    ])
    // Show current slide in the center of the view.
    const elCurrentSlide = document.querySelector('.vc_slide_preview.current-slide')
    if (elCurrentSlide) {
      elCurrentSlide.scrollIntoView({ block: 'center' })
    }
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
    methods: mapActions([
    'increasePreviewSize',
    'decreasePreviewSize'
  ])
}
</script>

<style lang="scss" scoped>
  .vc_slides_preview {
    padding: 1vw;
  }
</style>
