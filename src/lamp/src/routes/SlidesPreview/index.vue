<template>
  <div
    class="
      vc_slides_preview
      main-app-fullscreen
    "
    b-content-theme="default"
    :style="{ fontSize: previewSize + 'vw' }"
  >
    <div v-if="presentation">
      <display-controller/>
      <presentation-title/>
      <div v-if="slides">
        <span  v-if="previewLayoutCurrent.id === 'grid'">
          <grid-layout
            v-if="previewHierarchical"
            :slides="presentation.slidesTree"
          />
          <grid-layout
            v-if="!previewHierarchical"
            :slides="presentation.slides"
          />
        </span>
        <list-layout
          v-if="previewLayoutCurrent.id === 'list'"
          :slides="presentation.slides"
        />
      </div>
    </div>
    <loading-icon v-else/>
  </div>
</template>

<script>
import DisplayController from './DisplayController.vue'
import GridLayout from '@/components/SlidesPreview/GridLayout.vue'
import ListLayout from './ListLayout.vue'
import PresentationTitle from '@/components/PresentationTitle'
import LoadingIcon from '@/components/LoadingIcon'

import { routerGuards } from '@/lib.js'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'SlidesPreview',
  components: {
    DisplayController,
    GridLayout,
    ListLayout,
    PresentationTitle,
    LoadingIcon
  },
  mounted: function () {
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
    'slide',
    'slides',
    'slidesCount',
    'previewSize',
    'previewLayoutCurrent',
    'previewHierarchical'
  ]),
  methods: mapActions([
    'increasePreviewSize',
    'decreasePreviewSize'
  ]),
  ...routerGuards
}
</script>

<style lang="scss">
  .vc_slides_preview {
    font-size: 1.5vmin;
    padding: 1vw;

    .vc_presentation_title {
      font-size: 2em;

      header {
        font-size: 0.7em;
        text-align: center;
        width: 100%;
      }

      h1, h2 {
        margin-bottom: 0;
        text-align: center;
      }

      h1 {
        font-size: 1.6em;
      }

      h2 {
        font-size: 1.4em;
        font-weight: normal;
        margin-top: 0;
      }
    }
  }
</style>
