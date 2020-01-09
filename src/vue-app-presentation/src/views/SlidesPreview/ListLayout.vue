<template>
  <ol class="vc_list_hierarchical">
    <li
      v-for="slide in slides"
      :key="slide.no"
      @click="gotToSlide(slide.no)"
      :title="`Zur Folie Nr. ${slide.no}`"
      :class="{ 'current-slide': slideCurrent.no === slide.no }"
      :style="style(slide)"
    >
      <slide-preview :slide="slide"/>
      <div class="slide-info">
        <span class="master-title"> {{ slide.master.title }}: </span>
        <span class="slide-title">{{ slide.title }}</span>
        <div class="plain-text" v-if="!previewDetail">{{ slide.plainText }}</div>
      </div>
    </li>
  </ol>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')
import SlidePreview from './SlidePreview.vue'

export default {
  name: 'ListLayout',
  components: {
    SlidePreview
  },
  props: {
    slides: {
      type: Array
    }
  },
  computed: mapGetters([
    'presentation',
    'slideCurrent',
    'slidesCount',
    'previewDetail',
    'previewHierarchical'
  ]),
  methods: {
    style (slide) {
      if (this.previewHierarchical) {
        const padding = (slide.level - 1) * 3
        return { paddingLeft: `${padding}em` }
      }
    },
    gotToSlide (slideNo) {
      this.$store.dispatch('presentation/setSlideNoCurrent', slideNo)
      if (this.$route.name !== 'slides') this.$router.push({ name: 'slides' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_list_hierarchical {
    li {
      display: flex;
      cursor: pointer;
      list-style-type: none;
      padding: 0.5em;

      .slide-info {
        font-size: 1.5em;
        padding-left: 1em;
      }

      &:hover {
        background-color: scale-color($gray, $lightness: 80%);
      }

      &.current-slide {
        background-color: scale-color($yellow, $lightness: 80%);
      }

      &.current-slide:hover {
        background-color: scale-color($yellow, $lightness: 50%);
      }

      .master-title {
        font-weight: bold;
        font-family: $font-family-sans;
      }

      .plain-text {
        font-size: 0.9em;
        color: $gray;
      }
    }
  }
</style>
