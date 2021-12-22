<template>
  <ol class="vc_gird_hierarchical" v-if="slides">
    <li
      v-for="slide in slides"
      :key="slide.no"
      :title="`Zur Folie Nr. ${slide.no}`"
      :class="{ 'current-slide': slideCurrent && slide.no === slideCurrent.no }"
    >
      <hr v-if="slide.slides.length && hierarchical" />
      <slide-preview :slide="slide" />
      <grid-layout
        v-if="slide.slides.length && hierarchical"
        :slides="slide.slides"
      />
    </li>
  </ol>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  createNamespacedHelpers
} from '@bldr/vue-packages-bundler'

import SlidePreview from './SlidePreview.vue'

const { mapGetters } = createNamespacedHelpers('lamp/preview')

@Component({
  components: {
    SlidePreview
  },
  computed: mapGetters(['hierarchical'])
})
export default class GridLayout extends Vue {
  @Prop({
    type: Array
  })
  slides: any

  get slideCurrent () {
    return this.$store.getters['lamp/slide']
  }
}
</script>

<style lang="scss">
.vc_gird_hierarchical {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 3em;
  padding-top: 1em;
  overflow: hidden;

  hr {
    width: 100vw;
    opacity: 0;
  }

  li {
    list-style: none;
    margin: 0.3em;
  }
}
</style>
