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
    <ol v-if="slides">
      <li
        v-for="slide in slides"
        :key="slide.no"
        @click="gotToSlide(slide.no)"
        :title="`Zur Folie Nr. ${slide.no}`"
        :class="{ 'current-slide': slideCurrent.no === slide.no }"
      >
        <div class="slide-preview-wrapper">
          <slide-preview :slide="slide"/>
        </div>
          <material-icon
            :name="slide.master.icon.name"
            :color="slide.master.icon.color"
            outline="circle"
          />
      </li>
    </ol>
    <open-interface v-else/>
  </div>
</template>

<script>
import OpenInterface from '@/components/OpenInterface'
import SlidePreview from './SlidePreview.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'SlidesPreview',
  components: {
    OpenInterface,
    SlidePreview
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
    gotToSlide (slideNo) {
      this.$store.dispatch('presentation/setSlideNoCurrent', slideNo)
      if (this.$route.name !== 'slides') this.$router.push({ name: 'slides' })
    },
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

    .slide-preview-wrapper {
      background-color: $black;
      border: 1px solid $gray;
      color: $white;
      height: 15em;
      margin: 0em;
      overflow: hidden;
      width: 20em;
    }

    ol {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0;
    }

    li {
      list-style: none;
      position: relative;
      margin: 0.3em;
    }

    .baldr-icon {
      font-size: 2.5em;
      left: -0.3em;
      position: absolute;
      top: -0.3em;
    }
  }
</style>
