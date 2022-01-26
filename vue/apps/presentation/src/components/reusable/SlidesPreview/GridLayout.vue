<template>
  <ol class="vc_gird_layout" v-if="slides">
    <li
      v-for="slide in slides"
      :key="slide.no"
      :title="`Zur Folie Nr. ${slide.no}`"
      :class="{ 'current-slide': currentSlide && slide.no === currentSlide.no }"
    >
      <hr v-if="slide.slides.length && hierarchical" />
      <slide-preview :slide="slide" :slide-ng="presentationNg.getSlideByNo(slide.no)" />
      <grid-layout
        v-if="slide.slides.length && hierarchical"
        :slides="slide.slides"
      />
    </li>
  </ol>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import PreviewLayoutBase from './PreviewLayoutBase.vue'

@Component
export default class GridLayout extends PreviewLayoutBase {}
</script>

<style lang="scss">
.vc_gird_layout {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;
  padding-top: 1em;

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
