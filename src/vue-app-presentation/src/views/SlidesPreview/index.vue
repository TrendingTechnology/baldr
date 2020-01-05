<template>
  <div
    class="
      vc_slides_preview
      main-app-fullscreen
    "
    b-content-theme="default"
    :style="{ fontSize: fontSize + 'vw' }"
  >
    <h1>Folien-Vorschau</h1>

    <slide-list v-if="slides" :slides="presentation.slidesTree"/>
    <open-interface v-else/>
  </div>
</template>

<script>
import OpenInterface from '@/components/OpenInterface'
import SlideList from './SlideList.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'SlidesPreview',
  components: {
    OpenInterface,
    SlideList
  },
  data () {
    return {
      fontSize: 0.75
    }
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
    'slidesCount'
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
