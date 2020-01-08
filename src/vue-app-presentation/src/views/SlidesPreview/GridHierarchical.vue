<template>
  <ol
    class="vc_gird_hierarchical"
    v-if="slides"
  >
    <li
      v-for="slide in slides"
      :key="slide.no"
      :title="`Zur Folie Nr. ${slide.no}`"
      :class="{ 'current-slide': slideCurrent.no === slide.no }"
    >
      <hr v-if="slide.slides.length" />
      <slide-preview :slide="slide"/>
      <grid-hierarchical
        v-if="slide.slides.length"
        :slides="slide.slides"
      />
    </li>
  </ol>
</template>

<script>
import SlidePreview from './SlidePreview.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'GridHierarchical',
  props: {
    slides: {
      type: Array
    }
  },
  components: {
    SlidePreview
  },
  computed: mapGetters([
    'slideCurrent'
  ])
}
</script>

<style lang="scss" scoped>
  .vc_gird_hierarchical {
    hr {
      width: 80vw;
      opacity: 0;
    }

    ol {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding-left: 3em;
      padding-top: 1em;
      overflow: hidden;
    }

    li {
      list-style: none;
      position: relative;
      margin: 0.3em;
    }
  }
</style>
