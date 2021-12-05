<template>
  <ol class="vc_list_hierarchical">
    <li
      v-for="slide in slides"
      :key="slide.no"
      @click="gotToSlide(slide.no)"
      :title="`Zur Folie Nr. ${slide.no}`"
      :class="{ 'current-slide': slideCurrent && slide.no === slideCurrent.no }"
      :style="style(slide)"
    >
      <slide-preview :slide="slide"/>
      <div class="slide-info">
        <span class="master-title"> {{ slide.master.title }}: </span>
        <span class="slide-title" v-html="slide.title"/>
        <div class="plain-text" v-if="!detail">{{ slide.plainText }}</div>
      </div>
    </li>
  </ol>
</template>

<script>
import { createNamespacedHelpers } from '@bldr/vue-packages-bundler'
import SlidePreview from '@/components/reusable/SlidesPreview/SlidePreview.vue'
const { mapGetters } = createNamespacedHelpers('lamp/preview')
const storePreview = createNamespacedHelpers('lamp/preview')
const mapGettersPreview = storePreview.mapGetters

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
  computed: {
    ...mapGetters([
      'presentation',
      'slidesCount'
    ]),
    ...mapGettersPreview([
      'detail',
      'hierarchical'
    ]),
    slideCurrent () {
      return this.$store.getters['lamp/slide']
    }
  },
  methods: {
    style (slide) {
      if (this.previewHierarchical) {
        const padding = (slide.level - 1) * 3
        return { paddingLeft: `${padding}em` }
      }
    },
    gotToSlide (slideNo) {
      this.$store.dispatch('lamp/setSlideNoCurrent', slideNo)
      if (this.$route.name !== 'slide') this.$router.push({ name: 'slide' })
    }
  }
}
</script>

<style lang="scss">
  .vc_list_hierarchical {
    li {
      display: flex;
      cursor: pointer;
      list-style-type: none;
      padding: 0.5em;

      .slide-info {
        font-size: 2em;
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
        color: $gray;
      }
    }
  }
</style>
