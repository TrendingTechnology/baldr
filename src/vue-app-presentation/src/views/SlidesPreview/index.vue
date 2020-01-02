<template>
  <div class="vc_slides_preview default-padding" b-content-theme="default">
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
    .slide-preview-wrapper {
      height: 30vw;
      width: 40vw;
      background-color: $black;
      margin: 1vw;
      color: $white;
    }

    li {
      position: relative;
    }

    .baldr-icon {
      position: absolute;
      top: -2vw;
      left: 0;
      font-size: 3vw;
    }
  }
</style>
