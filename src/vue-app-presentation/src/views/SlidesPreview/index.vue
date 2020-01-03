<template>
  <div class="vc_slides_preview" b-content-theme="default">
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
  mounted: function () {
    this.$styleConfig.set({
      centerVertically: false,
      overflow: false
    })
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_slides_preview {
    padding: 1em;

    .slide-preview-wrapper {
      background-color: $black;
      color: $white;
      height: 15em;
      margin: 0em;
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

<style lang="scss">
  .vc_slides_preview {
    font-size: 0.75vw !important;
  }
</style>
